import { createWrapper } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './api/api-slice';
import { adminReducer } from './admin';
import { clientReducer } from './client';
import { commonReducer } from './common';
import { globalSlice } from './global';

const makeStore = () =>
    configureStore({
        reducer: {
            client: clientReducer,
            admin: adminReducer,
            common: commonReducer,
            [globalSlice.name]: globalSlice.reducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);
