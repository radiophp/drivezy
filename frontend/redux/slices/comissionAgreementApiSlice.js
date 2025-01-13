import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

// Assuming your baseQuery setup is similar to the `dealsApiSlice`
export const customBaseQuery = async ({ url, method, body }) => {
    const state = store.getState();
    const token = state.auth.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
        // Assuming you want to handle errors similarly
        const error = await response.text();
        return { error: { status: response.status, data: error } };
    }

    const data = await response.json();
    console.log(data)
    return { data };
};

export const comissionAgreementApiSlice = createApi({
    reducerPath: 'comissionAgreementApi',
    baseQuery: customBaseQuery,
    //tagTypes: ['ComissionAgreement'],
    endpoints: (builder) => ({
        // Define endpoints here
        getComissionAgreementById: builder.query({
            query: (id) => `invoice/comissionAgreement/${id}`,
        }),
        createComissionAgreement: builder.mutation({
            query: (agreement) => ({
                url: 'invoice/comissionAgreement',
                method: 'POST',
                body: agreement,
            }),
        }),
        updateComissionAgreement: builder.mutation({
            query: ({ id, ...updatedAgreement }) => ({
                url: `invoice/comissionAgreement/${id}`,
                method: 'PUT',
                body: updatedAgreement,
            }),
        }),
        deleteComissionAgreement: builder.mutation({
            query: (id) => ({
                url: `invoice/comissionAgreement/${id}`,
                method: 'DELETE',
            }),
        }),

        // Getting all mwstInvoices
        getAllComissionAgreements: builder.query({
            query: () => ({
                url: 'invoice/comissionAgreement/',
                method: 'GET'
            }),
        }),
        // Add other endpoints as needed
    }),
});

// Export hooks for each endpoint
export const {
    useGetComissionAgreementByIdQuery,
    useCreateComissionAgreementMutation,
    useUpdateComissionAgreementMutation,
    useDeleteComissionAgreementMutation,
    useGetAllComissionAgreementsQuery,
} = comissionAgreementApiSlice;
