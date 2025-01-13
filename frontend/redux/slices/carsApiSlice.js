import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from "@/redux/store";

export const customBaseQuery = async ({ url, method, body }) => {
    const state = store.getState();
    const token = state.auth.token;



    // Content-Type should not be set manually if the body is FormData.
    const headers = token ? {
        Authorization: `${token}`,
    } : {};

    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        method,
        headers,
        body,
    });

    const data = await response.json();
    return { data };
};

export const carsApiSlice = createApi({
    reducerPath: 'carsApi',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: 0, // This will effectively disable caching
    tagTypes: ['Cars'], // Declare the tag types for cars
    endpoints: (builder) => ({
        // Getting all cars
        getAllCars: builder.query({
            query: () => ({
                url: 'cars',
                method: 'GET',
            }),
        }),
        // Getting all Available cars
        getAllAvailableCars : builder.query({
            query: () => ({
                url: 'cars/available',
                method: 'GET',
            }),
        }),
        getAllCarsWithInvoices : builder.query({
            query: () => ({
                url: 'cars/invoices',
                method: 'GET',
            }),
        }),
        // Add this new endpoint for commission invoices
        getAllCarsWithCommissionInvoices: builder.query({
            query: () => ({
                url: 'cars/comissionInvoices',
                method: 'GET',
            }),
        }),
        // Getting a car by ID
        getCarById: builder.query({
            query: (id) => ({
                url: `car/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),
        // Adding a new car
        addCar: builder.mutation({
            query: (newCar) => ({
                url: 'car',
                method: 'POST',
                body: newCar,
            }),
        }),
        // Updating a car by ID
        updateCar: builder.mutation({
            query: ({ id, updatedCar }) => ({
                url: `car/${id}`,
                method: 'PUT',
                body: updatedCar,
            }),

        }),
        // Deleting a car by ID
        deleteCar: builder.mutation({
            query: (id) => ({
                url: `car/${id}`,
                method: 'DELETE',
            }),
        }),
        // Mutation to upload images
        setCarImages: builder.mutation({
            query: (data) => {
                // 'data' should be an instance of FormData
                return {
                    url: 'car-image',
                    method: 'POST',
                    body: data, // FormData will be handled correctly by the customBaseQuery
                };
            },
        }),
        deleteCarImage: builder.mutation({
            query: ({ car, image  }) => {
                return {
                        url: `car/image`,
                        method: 'DELETE',
                        body: { car, image  },
                    };
            },

            // Adjust the invalidation logic as per your cache setup
        }),
        // Mutation to upload buy documents
        setCarBuyDocuments: builder.mutation({
            query: (data) => {
                // 'data' should be an instance of FormData
                return {
                    url: 'car-buyDocuments',
                    method: 'POST',
                    body: data, // FormData will be handled correctly by the customBaseQuery
                };
            },
            // Add any additional properties or methods as needed
        }),
    }),
});

// Exporting hooks for each endpoint
export const {
    useGetAllCarsQuery,
    useGetCarByIdQuery,
    useAddCarMutation,
    useUpdateCarMutation,
    useDeleteCarMutation,
    useSetCarImagesMutation,
    useDeleteCarImageMutation,
    useSetCarBuyDocumentsMutation,
    useGetAllAvailableCarsQuery,
    useGetAllCarsWithInvoicesQuery,
    useGetAllCarsWithCommissionInvoicesQuery,
} = carsApiSlice;
