// Importing necessary functions from Redux Toolkit and the auth API slice
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApiSlice'; // Adjust the import path according to your file structure

// Initial state of the auth slice
const initialState = {
    token: null, // To store the authentication token
    userData: null, // To store user information
    status: 'idle', // To track the loading status
    error: null, // To store any error message
    isLogin: false,// To store login status
};

// Creating the auth slice
const authSlice = createSlice({
    name: 'auth', // Name of the slice
    initialState, // Initial state
    reducers: {
        // A reducer to handle logout - it resets the state to the initial state
        logout: (state) => {
            state.token = null;
            state.userData = null;
            state.status = 'idle';
            state.error = null;
            state.isLogin = false;
        },
    },
    extraReducers: (builder) => {
        // Handling actions from the auth API slice

        // Handling the loading state when the login request is initiated
        builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
            state.status = 'loading';
            state.isLogin = false;
        });

        // Handling the state update when the login request is successful
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
            state.status = 'succeeded';
            // Storing the received token and user info in the state
            // Adjust these lines according to your API’s response structure
            state.token = action.payload.data.token;
            state.userData = action.payload.data;
            // Save token to localStorage
            localStorage.setItem('token', action.payload.data.token); // Saving the token to localStorage here
            state.isLogin = true;
        });

        // Handling the error state when the login request fails
        builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
            state.status = 'failed';
            state.isLogin = false;
            // Storing the error message in the state
            // Adjust this line according to your API’s error structure
            state.error = action.error.message;
        });
    },
});

// Exporting the logout action to be used in components
export const { logout } = authSlice.actions;
export const selectIsLogin = state => state.auth.isLogin;
// Exporting the reducer to be used in the Redux store
export default authSlice.reducer;

