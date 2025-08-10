import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetReviewStatsQuery } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewStats({ productId }) {
  const { data: stats, isLoading, error } = useGetReviewStatsQuery(productId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-full h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return null;
  }

  const { totalReviews, averageRating, ratingCounts } = stats;

  if (totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="mb-2 text-gray-400">
              <StarRating rating={0} readonly size="lg" />
            </div>
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500">
              Be the first to review this product!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Rating */}
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {averageRating}
              </div>
              <StarRating rating={averageRating} readonly size="md" />
              <p className="mt-1 text-sm text-gray-600">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating] || 0;
              const percentage = getPercentage(count);

              return (
                <div key={rating} className="flex gap-2 items-center text-sm">
                  <span className="w-8 text-right">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                  <span className="w-10 text-xs text-gray-500">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewStats;
