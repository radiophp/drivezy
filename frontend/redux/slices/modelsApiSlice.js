import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

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

export const modelsApiSlice = createApi({
    reducerPath: 'modelsApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['Models'], // Declare the tag types for models
    endpoints: (builder) => ({
        // Getting all models
        getAllModels: builder.query({
            query: () => ({
                url: 'models',
                method: 'GET'
            }),
        }),
        // Getting a model by ID
        getModelById: builder.query({
            query: (id) => ({
                url: `model/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new model
        addModel: builder.mutation({
            query: (newModel) => ({
                url: 'model',
                method: 'POST',
                body: newModel,
            }),
        }),
        // Updating a model by ID
        updateModel: builder.mutation({
            query: ({ id, updatedModel }) => ({
                url: `model/${id}`,
                method: 'PUT',
                body: updatedModel,
            }),
        }),
        // Deleting a model by ID
        deleteModel: builder.mutation({
            query: (id) => ({
                url: `model/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllModelsQuery,
    useGetModelByIdQuery,
    useAddModelMutation,
    useUpdateModelMutation,
    useDeleteModelMutation,
} = modelsApiSlice;
