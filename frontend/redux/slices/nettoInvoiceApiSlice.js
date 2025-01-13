// nettoInvoiceApiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

export const customNettoInvoiceQuery = async ({ url, method, body }) => {
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

export const nettoInvoiceApiSlice = createApi({
    reducerPath: 'nettoInvoiceApi',
    baseQuery: customNettoInvoiceQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['NettoInvoice'], // Declare the tag types for nettoInvoice
    endpoints: (builder) => ({
        // Getting all nettoInvoices
        getAllNettoInvoices: builder.query({
            query: () => ({
                url: 'invoice/netto',
                method: 'GET'
            }),
        }),
        // Getting a nettoInvoice by ID
        getNettoInvoiceById: builder.query({
            query: (id) => ({
                url: `invoice/netto/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
//
        // Adding a new nettoInvoice
        addNettoInvoice: builder.mutation({
            query: (newNettoInvoice) => ({
                url: 'invoice/netto',
                method: 'POST',
                body: newNettoInvoice,
            }),
        }),
        // Updating a nettoInvoice by ID
        updateNettoInvoice: builder.mutation({
            query: ({ id, updatedNettoInvoice }) => ({
                url: `invoice/netto/${id}`,
                method: 'PUT',
                body: updatedNettoInvoice,
            }),
        }),
        // Deleting a nettoInvoice by ID
        deleteNettoInvoice: builder.mutation({
            query: (id) => ({
                url: `invoice/netto/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllNettoInvoicesQuery,
    useGetNettoInvoiceByIdQuery,
    useAddNettoInvoiceMutation,
    useUpdateNettoInvoiceMutation,
    useDeleteNettoInvoiceMutation,
} = nettoInvoiceApiSlice;
