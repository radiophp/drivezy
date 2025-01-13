import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {store} from "@/redux/store";

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

export const colorsApiSlice = createApi({
    reducerPath: 'colorsApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['Colors'], // Add this line to declare the tag types
    endpoints: (builder) => ({
        // Getting all colors
        getAllColors: builder.query({
            query: () => ({
                url: 'colors',
                method: 'GET'
            }),
        }),
        // Getting a color by ID
        getColorById: builder.query({
            query: (id) => ({
                url: `color/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new color
        addColor: builder.mutation({
            query: (newColor) => ({
                url: 'color',
                method: 'POST',
                body: newColor,
            }),
        }),
        // Updating a color by ID
        updateColor: builder.mutation({
            query: ({ id, updatedColor }) => ({
                url: `color/${id}`,
                method: 'PUT',
                body: updatedColor,
            }),
        }),
        // Deleting a color by ID
        deleteColor: builder.mutation({
            query: (id) => ({
                url: `color/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllColorsQuery,
    useGetColorByIdQuery,
    useAddColorMutation,
    useUpdateColorMutation,
    useDeleteColorMutation,
} = colorsApiSlice;
