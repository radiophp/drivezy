// dfzInvoiceApiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

export const customDfzInvoiceQuery = async ({ url, method, body }) => {
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

export const dfzInvoiceApiSlice = createApi({
    reducerPath: 'dfzInvoiceApi',
    baseQuery: customDfzInvoiceQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['DfzInvoice'], // Declare the tag types for DfzInvoice
    endpoints: (builder) => ({
        // Getting all dfzInvoices
        getAllDfzInvoices: builder.query({
            query: () => ({
                url: 'invoice/dfz',
                method: 'GET'
            }),
        }),
        // Getting a dfzInvoice by ID
        getDfzInvoiceById: builder.query({
            query: (id) => ({
                url: `invoice/dfz/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new dfzInvoice
        addDfzInvoice: builder.mutation({
            query: (newDfzInvoice) => ({
                url: '/invoice/dfz',
                method: 'POST',
                body: newDfzInvoice,
            }),
        }),
        // Updating a dfzInvoice by ID
        updateDfzInvoice: builder.mutation({
            query: ({ id, updatedDfzInvoice }) => ({
                url: `invoice/dfz/${id}`,
                method: 'PUT',
                body: updatedDfzInvoice,
            }),
        }),
        // Deleting a dfzInvoice by ID
        deleteDfzInvoice: builder.mutation({
            query: (id) => ({
                url: `invoice/dfz/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllDfzInvoicesQuery,
    useGetDfzInvoiceByIdQuery,
    useAddDfzInvoiceMutation,
    useUpdateDfzInvoiceMutation,
    useDeleteDfzInvoiceMutation,
} = dfzInvoiceApiSlice;
