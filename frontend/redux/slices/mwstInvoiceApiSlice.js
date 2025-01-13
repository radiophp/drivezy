// mwstInvoiceApiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

// Use the same customBaseQuery since it contains the logic for token-based authentication
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

export const mwstInvoiceApiSlice = createApi({
    reducerPath: 'mwstInvoiceApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
   // tagTypes: ['MwstInvoice'], // Declare the tag types for MwstInvoice
    endpoints: (builder) => ({
        // Getting all mwstInvoices
        getAllMwstInvoices: builder.query({
            query: () => ({
                url: 'invoice/mwst',
                method: 'GET'
            }),
            transformResponse: (response) => {
                // Check if the response was successful and has data
                if (response.success && Array.isArray(response.data)) {

                    // Normalize the data
                    const result =  response.data.map(item => ({
                        ...item,
                        _id: item.invoiceDetails._id, // Set the normalized ID
                    }));


                    return result;
                }

                return response; // Return the original response if conditions are not met
            },
        }),
        // Getting a mwstInvoice by ID
        getMwstInvoiceById: builder.query({
            query: (id) => ({
                url: `/invoice/mwst/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new mwstInvoice
        addMwstInvoice: builder.mutation({
            query: (newMwstInvoice) => ({
                url: 'invoice/mwst/',
                method: 'POST',
                body: newMwstInvoice,
            }),
        }),
        // Updating a mwstInvoice by ID
        updateMwstInvoice: builder.mutation({
            query: ({ id, updatedMwstInvoice }) => ({
                url: `/invoice/mwst/${id}`,
                method: 'PUT',
                body: updatedMwstInvoice,
            }),
        }),
        // Deleting a mwstInvoice by ID
        deleteMwstInvoice: builder.mutation({
            query: (id) => ({
                url: `/invoice/mwst/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllMwstInvoicesQuery,
    useGetMwstInvoiceByIdQuery,
    useAddMwstInvoiceMutation,
    useUpdateMwstInvoiceMutation,
    useDeleteMwstInvoiceMutation,
} = mwstInvoiceApiSlice;
