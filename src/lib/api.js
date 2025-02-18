// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
    }),
    getCategories: builder.query({
      query: () => `categories`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetCategoriesQuery } = Api;