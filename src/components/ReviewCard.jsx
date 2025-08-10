import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import {
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useReportReviewMutation,
} from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ReviewCard({ review, onEdit = () => {} }) {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const [deleteReview] = useDeleteReviewMutation();
  const [markReviewHelpful] = useMarkReviewHelpfulMutation();
  const [reportReview] = useReportReviewMutation();

  const isOwnReview = user?.id === review.userId;
  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteReview(review._id).unwrap();
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkHelpful = async () => {
    setIsMarkingHelpful(true);
    try {
      await markReviewHelpful(review._id).unwrap();
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      toast.error("Failed to mark as helpful");
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const handleReport = async () => {
    if (!confirm("Are you sure you want to report this review?")) {
      return;
    }

    setIsReporting(true);
    try {
      await reportReview(review._id).unwrap();
      toast.success("Review reported successfully");
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error("Failed to report review");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <StarRating rating={review.rating} readonly size="sm" />
                {review.isVerifiedPurchase && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified Purchase
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnReview ? (
                  <>
                    <DropdownMenuItem onClick={() => onEdit(review)}>
                      Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600"
                    >
                      {isDeleting ? "Deleting..." : "Delete Review"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={handleReport}
                    disabled={isReporting}
                    className="text-red-600"
                  >
                    {isReporting ? "Reporting..." : "Report Review"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Review Title */}
          {review.title && (
            <h4 className="font-semibold text-gray-900">{review.title}</h4>
          )}

          {/* Review Comment */}
          <p className="leading-relaxed text-gray-700">{review.comment}</p>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span className="font-medium">{review.userName}</span>
              <span>•</span>
              <span>{reviewDate}</span>
            </div>

            {/* Helpful Button */}
            {!isOwnReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkHelpful}
                disabled={isMarkingHelpful}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                👍 Helpful ({review.helpfulVotes})
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
