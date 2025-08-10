// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8000/api/", // For local development
    baseUrl: "https://mebius-backend-sinel.onrender.com/api/", // For production
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken(); // Avoids runtime error

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
      providesTags: ["Product"],
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    getCategories: builder.query({
      query: () => `categories`,
      providesTags: ["Category"],
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
    }),
    getUserOrders: builder.query({
      query: () => `orders`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `orders`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    checkStock: builder.query({
      query: ({ productId, quantity }) =>
        `products/check-stock?productId=${productId}&quantity=${quantity}`,
    }),
    // Review endpoints
    getReviews: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        return `reviews?${searchParams.toString()}`;
      },
      providesTags: ["Review"],
    }),
    getReviewStats: builder.query({
      query: (productId) => `reviews/stats/${productId}`,
      providesTags: ["Review"],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: `reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, ...body }) => ({
        url: `reviews/${reviewId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
    markReviewHelpful: builder.mutation({
      query: (reviewId) => ({
        url: `reviews/${reviewId}/helpful`,
        method: "POST",
      }),
      invalidatesTags: ["Review"],
    }),
    reportReview: builder.mutation({
      query: (reviewId) => ({
        url: `reviews/${reviewId}/report`,
        method: "POST",
      }),
      invalidatesTags: ["Review"],
    }),

    // Admin endpoints
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `products`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, ...productData }) => ({
        url: `products/${productId}`,
        method: "PATCH",
        body: productData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        "Product",
        { type: "Product", id: productId },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Category management endpoints
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: `categories`,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, ...categoryData }) => ({
        url: `categories/${categoryId}`,
        method: "PATCH",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // Order management endpoints
    getAllOrders: builder.query({
      query: ({ status = "all", page = 1, limit = 20 } = {}) =>
        `orders/admin/all?status=${status}&page=${page}&limit=${limit}`,
      providesTags: ["Order"],
    }),
    getOrderStats: builder.query({
      query: () => `orders/admin/stats`,
      providesTags: ["OrderStats"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, ...statusData }) => ({
        url: `orders/admin/${orderId}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: ["Order", "OrderStats"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetUserOrdersQuery,
  useCheckStockQuery,
  // Review hooks
  useGetReviewsQuery,
  useGetReviewStatsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useReportReviewMutation,
  // Admin hooks
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // Category hooks
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Order management hooks
  useGetAllOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} = Api;
