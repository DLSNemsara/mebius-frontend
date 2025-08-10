import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import ReviewStats from "./ReviewStats";
import { useGetReviewsQuery } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ReviewsSection({ productId }) {
  const { user, isSignedIn } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterRating, setFilterRating] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetReviewsQuery({
    productId,
    sortBy,
    sortOrder: "desc",
    ...(filterRating !== "all" && { rating: filterRating }),
    page,
    limit: 10,
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    refetch();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowForm(false);
  };

  const userHasReviewed = reviewsData?.reviews?.some(
    (review) => review.userId === user?.id
  );

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <ReviewStats productId={productId} />

      {/* Write Review Button/Form */}
      {isSignedIn && !userHasReviewed && !showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                Share your experience with this product
              </p>
              <Button onClick={() => setShowForm(true)}>Write a Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onSuccess={handleFormSuccess}
          onCancel={editingReview ? handleCancelEdit : () => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reviews</CardTitle>

            {/* Filters and Sorting */}
            <div className="flex gap-2 items-center">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Most recent</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="helpfulVotes">Most helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-full h-16" />
                  <Skeleton className="w-48 h-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-600">Failed to load reviews</p>
              <Button variant="outline" onClick={refetch} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : !reviewsData?.reviews?.length ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                {filterRating !== "all"
                  ? `No ${filterRating}-star reviews found`
                  : "No reviews yet"}
              </p>
              {filterRating === "all" && isSignedIn && !userHasReviewed && (
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="mt-2"
                >
                  Be the first to review
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviewsData.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onEdit={handleEditReview}
                />
              ))}

              {/* Pagination */}
              {reviewsData.pagination.totalPages > 1 && (
                <div className="flex gap-2 justify-center items-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!reviewsData.pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {reviewsData.pagination.currentPage} of{" "}
                    {reviewsData.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!reviewsData.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ReviewsSection;
