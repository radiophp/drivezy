import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {store} from "@/redux/store";

export const customBaseQuery = async ({ url, method, body }) => {
    const state = store.getState();  // access the Redux state

    const token = state.auth.token;  // access the token from the state

    // rest of your baseQuery logic
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `${token}` } : {}),
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return { data };
};
export const brandsApiSlice = createApi({
    reducerPath: 'brandsApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0 ,// This will effectively disable caching
    tagTypes: ['Brands'], // Add this line to declare the tag types
    endpoints: (builder) => ({
        // Getting all brands
        getAllBrands: builder.query({
            query: () => ({
                url: 'brands',
                method: 'GET'
            }),
           // providesTags: ['Brands'], // Add this line to tag this query result
        }),
        // Getting a brand by ID
        getBrandById: builder.query({
            query: (id) => ({
                url: `brand/${id}`, // Correct the URL construction here
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
           // providesTags: (result, error, id) => [{ type: 'Brands', id }], // Add this line
        }),
        // Adding a new brand
        addBrand: builder.mutation({
            query: (newBrand) => ({
                url: 'brand',
                method: 'POST',
                body: newBrand,
            }),
            // invalidatesTags: (result, error, { id }) => [
            //     { type: 'Brands', id }, // Invalidates the cache for the specific updated brand
            //     'Brands' // Invalidates the cache for all brands
            // ],
        }),
        // Updating a brand by ID
        updateBrand: builder.mutation({
            query: ({ id, updatedBrand }) => ({
                url: `brand/${id}`,
                method: 'PUT',
                body: updatedBrand,
            }),
            // invalidatesTags: (result, error, { id }) => [
            //     { type: 'Brands', id }, // Invalidates the cache for the specific updated brand
            //     'Brands' // Invalidates the cache for all brands
            // ],
        }),
        // Deleting a brand by ID
        deleteBrand: builder.mutation({
            query: (id) => ({
                url: `brand/${id}`,
                method: 'DELETE',
            }),
            // invalidatesTags: (result, error, { id }) => [
            //     { type: 'Brands', id }, // Invalidates the cache for the specific updated brand
            //     'Brands' // Invalidates the cache for all brands
            // ],
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllBrandsQuery,
    useGetBrandByIdQuery,
    useAddBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
} = brandsApiSlice;

