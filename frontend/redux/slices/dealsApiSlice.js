import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

export const customBaseQuery = async ({ url, method, body }) => {
    const state = store.getState();  // access the Redux state
    const token = state.auth.token;  // access the token from the state

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

export const dealsApiSlice = createApi({
    reducerPath: 'dealsApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['Deals'], // Declare the tag types for deals
    endpoints: (builder) => ({
        // Getting all deals
        getAllDeals: builder.query({
            query: () => ({
                url: 'deals',
                method: 'GET',
            }),
        }),
        // Getting a deal by ID
        getDealById: builder.query({
            query: (id) => ({
                url: `deal/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new deal
        addDeal: builder.mutation({
            query: (newDeal) => ({
                url: 'deal',
                method: 'POST',
                body: newDeal,
            }),
        }),
        // Updating a deal by ID
        updateDeal: builder.mutation({
            query: ({ id, updatedDeal }) => ({
                url: `deal/${id}`,
                method: 'PUT',
                body: updatedDeal,
            }),
        }),
        // Deleting a deal by ID
        deleteDeal: builder.mutation({
            query: (id) => ({
                url: `deal/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllDealsQuery,
    useGetDealByIdQuery,
    useAddDealMutation,
    useUpdateDealMutation,
    useDeleteDealMutation,
} = dealsApiSlice;
