// // Need to use the React-specific entry point to import createApi
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // Define a service using a base URL and expected endpoints
// export const Api = createApi({
//   reducerPath: "Api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:8000/api/", // Change this for production
//     prepareHeaders: async (headers, { getState }) => {
//       const token = await window.Clerk?.session?.getToken(); // Avoids runtime error
//       console.log("Auth Token:", token); // Debugging (remove in production)

//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),

//   endpoints: (builder) => ({
//     getProducts: builder.query({
//       query: () => `products`,
//     }),
//     getCategories: builder.query({
//       query: () => `categories`,
//     }),
//     getOrder: builder.query({
//       query: (id) => `orders/${id}`,
//     }),
//     createOrder: builder.mutation({
//       query: (body) => ({
//         url: `orders`,
//         method: "POST",
//         body,
//       }),
//     }),
//   }),
// });

// // Export hooks for usage in functional components
// export const {
//   useGetProductsQuery,
//   useGetCategoriesQuery,
//   useCreateOrderMutation,
//   useGetOrderQuery,
// } = Api;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: async (headers, { getState }) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
    }),
    getCategories: builder.query({
      query: () => `categories`,
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `orders`,
        method: "POST",
        body,
      }),
      transformResponse: (response, meta) => {
        // Log the response for debugging
        console.log("Transform Response:", response);
        console.log("Response Headers:", meta?.response?.headers);

        // If response is null but status is 201, create a dummy response
        if (!response && meta?.response?.status === 201) {
          // Get ID from the last created order
          const pathParts = meta?.response?.url.split("/");
          const orderId = pathParts[pathParts.length - 1];
          return { _id: orderId };
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
} = Api;
