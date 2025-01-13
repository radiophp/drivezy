import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from '@/redux/slices/authSlice';
import { authApi } from '@/redux//slices/authApiSlice';
import { brandsApiSlice } from "@/redux/slices/brandsApiSlice";
import { colorsApiSlice } from "@/redux/slices/colorsApiSlice";
import { modelsApiSlice } from "@/redux/slices/modelsApiSlice";
import { carsApiSlice } from "@/redux/slices/carsApiSlice";
import { customersApiSlice } from "@/redux/slices/customersApiSlice";  // Import the customersApiSlice
import { dealsApiSlice } from "@/redux/slices/dealsApiSlice";
import {baseInfoApiSlice} from "@/redux/slices/baseInfoApiSlice";  // Import the customersApiSlice
import {dfzInvoiceApiSlice} from "@/redux/slices/dfzInvoiceApiSlice";  // Import the customersApiSlice
import {mwstInvoiceApiSlice} from "@/redux/slices/mwstInvoiceApiSlice";  // Import the customersApiSlice
import {nettoInvoiceApiSlice} from "@/redux/slices/nettoInvoiceApiSlice";  // Import the customersApiSlice
import {comissionAgreementApiSlice} from "@/redux/slices/comissionAgreementApiSlice";  // Import the customersApiSlice
import {purchaseWithWarrantyApiSlice} from "@/redux/slices/purchaseWithWarrantyApiSlice";  // Import the customersApiSlice
import {countriesApiSlice} from "@/redux/slices/countriesApiSlice";  // Import the customersApiSlice
import {stateApiSlice} from "@/redux/slices/stateApiSlice";  // Import the customersApiSlice
import {reportsApiSlice} from "@/redux/slices/reportsApiSlice";  // Import the customersApiSlice

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['token', 'userData', 'isLogin']
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
    },
});

export const store = configureStore({
    reducer: {
        [brandsApiSlice.reducerPath]: brandsApiSlice.reducer,
        [baseInfoApiSlice.reducerPath]: baseInfoApiSlice.reducer,
        [colorsApiSlice.reducerPath]: colorsApiSlice.reducer,
        [modelsApiSlice.reducerPath]: modelsApiSlice.reducer,
        [carsApiSlice.reducerPath]: carsApiSlice.reducer,
        [customersApiSlice.reducerPath]: customersApiSlice.reducer,
        [dealsApiSlice.reducerPath]: dealsApiSlice.reducer, // Add the customersApiSlice reducer
        [authApi.reducerPath]: authApi.reducer,
        [dfzInvoiceApiSlice.reducerPath]: dfzInvoiceApiSlice.reducer,
        [mwstInvoiceApiSlice.reducerPath]:  mwstInvoiceApiSlice.reducer,
        [nettoInvoiceApiSlice.reducerPath]:  nettoInvoiceApiSlice.reducer,
        [comissionAgreementApiSlice.reducerPath]:  comissionAgreementApiSlice.reducer,
        [purchaseWithWarrantyApiSlice.reducerPath]:  purchaseWithWarrantyApiSlice.reducer,
        [stateApiSlice.reducerPath]:  stateApiSlice.reducer,
        [countriesApiSlice.reducerPath]:  countriesApiSlice.reducer,
        [reportsApiSlice.reducerPath]:  reportsApiSlice.reducer,
        auth: persistedReducer
    },
    middleware: customizedMiddleware
        .concat(
            authApi.middleware,
            baseInfoApiSlice.middleware,
            brandsApiSlice.middleware,
            colorsApiSlice.middleware,
            modelsApiSlice.middleware,
            carsApiSlice.middleware,
            dealsApiSlice.middleware,
            mwstInvoiceApiSlice.middleware,
            nettoInvoiceApiSlice.middleware,
            dfzInvoiceApiSlice.middleware,
            comissionAgreementApiSlice.middleware,
            purchaseWithWarrantyApiSlice.middleware,
            countriesApiSlice.middleware,
            stateApiSlice.middleware,
            customersApiSlice.middleware ,
            reportsApiSlice.middleware
        ),
});

export const Persistor = persistStore(store);
