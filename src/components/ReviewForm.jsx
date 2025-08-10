import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { useCreateReviewMutation, useUpdateReviewMutation } from "@/lib/api";
import { toast } from "sonner";

function ReviewForm({
  productId,
  existingReview = null,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const { user, isSignedIn } = useUser();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId,
        rating,
        comment: comment.trim(),
        ...(title.trim() && { title: title.trim() }),
      };

      if (existingReview) {
        await updateReview({
          reviewId: existingReview._id,
          ...reviewData,
        }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createReview(reviewData).unwrap();
        toast.success("Review submitted successfully!");
      }

      // Reset form if creating new review
      if (!existingReview) {
        setRating(0);
        setTitle("");
        setComment("");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Please sign in to leave a review for this product.
            </p>
            <Button variant="outline">Sign In to Review</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label htmlFor="rating" className="text-base font-medium">
              Rating *
            </Label>
            <div className="mt-1">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
                showValue={true}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Review Title (Optional)
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              maxLength={100}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-medium">
              Your Review *
            </Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="px-3 py-2 mt-1 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
            <p className="mt-1 text-xs text-gray-500">
              {comment.length}/2000 characters (minimum 10)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={
                isSubmitting || rating === 0 || comment.trim().length < 10
              }
              className="flex-1"
            >
              {isSubmitting
                ? existingReview
                  ? "Updating..."
                  : "Submitting..."
                : existingReview
                  ? "Update Review"
                  : "Submit Review"}
            </Button>
            {existingReview && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;
