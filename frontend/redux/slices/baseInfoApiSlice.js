import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

// Use the same customBaseQuery for authentication
const customBaseQuery = async ({ url, method, body }) => {
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

export const baseInfoApiSlice = createApi({
    reducerPath: 'baseInfoApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['BaseInfo'], // Declare the tag types for baseInfo
    endpoints: (builder) => ({
        // Getting all baseInfos
        getAllBaseInfos: builder.query({
            query: () => ({
                url: 'baseInfos',
                method: 'GET'
            }),
        }),
        // Getting a baseInfo by ID
        getBaseInfoById: builder.query({
            query: (id) => ({
                url: `baseInfo/`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new baseInfo
        addBaseInfo: builder.mutation({
            query: (newBaseInfo) => ({
                url: 'baseInfo',
                method: 'POST',
                body: newBaseInfo,
            }),
        }),
        // Updating a baseInfo by ID
        updateBaseInfo: builder.mutation({
            query: ({ id, updatedBaseInfo }) => ({
                url: `baseInfo/${id}`,
                method: 'PUT',
                body: updatedBaseInfo,
            }),
        }),
        // Deleting a baseInfo by ID
        deleteBaseInfo: builder.mutation({
            query: (id) => ({
                url: `baseInfo/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllBaseInfosQuery,
    useGetBaseInfoByIdQuery,
    useAddBaseInfoMutation,
    useUpdateBaseInfoMutation,
    useDeleteBaseInfoMutation,
} = baseInfoApiSlice;
