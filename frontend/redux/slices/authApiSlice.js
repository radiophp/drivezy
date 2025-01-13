import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//////////
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: process.env.NEXT_PUBLIC_BACKEND_URL+"login",
                method: 'POST',
                body: credentials,
            }),
        }),
        // Add more endpoints like logout, register, etc.
    }),
});

export const { useLoginMutation } = authApi;
