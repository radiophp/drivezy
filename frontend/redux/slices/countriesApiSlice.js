import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {store} from "@/redux/store";
export const customBaseQuery = async ({ url, method, body }) => {
    const state = store.getState();  // access the Redux state

    const token = state.auth.token;  // access the token from the state

    // rest of your baseQuery logic
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

export const countriesApiSlice = createApi({
    reducerPath: 'countriesApi',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getAllCountries: builder.query({
            query: () => ({ url: '/city/allCountries', method: 'GET' }),
        }),
    }),
});

export const {
    useGetAllCountriesQuery,
} = countriesApiSlice;
