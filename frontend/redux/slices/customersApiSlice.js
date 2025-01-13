import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

// Reusing the customBaseQuery from brandApiSlice.js
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

export const customersApiSlice = createApi({
    reducerPath: 'customersApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['Customers'], // Declare the tag types
    endpoints: (builder) => ({
        // Getting all customers
        getAllCustomers: builder.query({
            query: () => ({
                url: 'customers',
                method: 'GET'
            }),
        }),
        // Getting a customer by ID
        getCustomerById: builder.query({
            query: (id) => ({
                url: `customer/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new customer
        addCustomer: builder.mutation({
            query: (newCustomer) => ({
                url: 'customer',
                method: 'POST',
                body: newCustomer,
            }),
        }),
        // Updating a customer by ID
        updateCustomer: builder.mutation({
            query: ({ id, updatedCustomer }) => ({
                url: `customer/${id}`,
                method: 'PUT',
                body: updatedCustomer,
            }),
        }),
        // Deleting a customer by ID
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `customer/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllCustomersQuery,
    useGetCustomerByIdQuery,
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customersApiSlice;
