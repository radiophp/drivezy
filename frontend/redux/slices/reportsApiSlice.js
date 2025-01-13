import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

const customBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', token);
        }
        return headers;
    }
});

export const reportsApiSlice = createApi({
    reducerPath: 'reportsApi',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getWarehouseInvoice: builder.query({
            query: ({ date }) => ({
                url: 'invoice/wharehouse',
                method: 'POST',
                body: { date },
            }),
            // Specify refetching behavior
            refetchOnMount: true, // Refetch every time a component mounts
            refetchOnReconnect: true, // Refetch when reconnecting to the internet
        }),
        getDynamicInvoice: builder.query({
            query: ({ fields, date }) => ({
                url: 'invoice/dynamic',
                method: 'POST',
                body: { fields, date },
            }),
            refetchOnMount: true,
            refetchOnReconnect: true,
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetWarehouseInvoiceQuery,
    useGetDynamicInvoiceQuery,
} = reportsApiSlice;
