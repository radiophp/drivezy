import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {store} from "@/redux/store";

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
    return { data };
};

export const purchaseWithWarrantyApiSlice = createApi({
    reducerPath: 'purchaseWithWarrantyApi',
    baseQuery: customBaseQuery,
    tagTypes: ['PurchaseWithWarranty'],
    endpoints: (builder) => ({
        getPurchaseWithWarrantyById: builder.query({
            query: (id) => ({ url: `invoice/purchaseWithWarranty/${id}`, method: 'GET' }),
        }),
        createPurchaseWithWarranty: builder.mutation({
            query: (purchaseWithWarranty) => ({
                url: 'invoice/purchaseWithWarranty',
                method: 'POST',
                body: purchaseWithWarranty,
            }),
        }),
        updatePurchaseWithWarranty: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `invoice/purchaseWithWarranty/${id}`,
                method: 'PUT',
                body: rest,
            }),
        }),
        deletePurchaseWithWarranty: builder.mutation({
            query: (id) => ({
                url: `invoice/purchaseWithWarranty/${id}`,
                method: 'DELETE',
            }),
        }),
        getAllPurchasesWithWarranty: builder.query({
            query: () => ({ url: 'invoice/purchaseWithWarranty', method: 'GET' }),
            providesTags: ['PurchaseWithWarranty'],
        }),
        // Add other endpoints as needed
    }),
});

export const {
    useGetPurchaseWithWarrantyByIdQuery,
    useCreatePurchaseWithWarrantyMutation,
    useUpdatePurchaseWithWarrantyMutation,
    useDeletePurchaseWithWarrantyMutation,
    useGetAllPurchasesWithWarrantyQuery,
} = purchaseWithWarrantyApiSlice;
