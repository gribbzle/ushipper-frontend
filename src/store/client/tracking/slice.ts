import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    IsDriversListShown,
    SelectedActiveRequest,
    SelectedDriverId,
    SelectedOrder,
    SelectedShipperTrackingOrder,
    SelectedSuggestedOrderId,
    TrackingSliceState,
} from './types';

const initialState: TrackingSliceState = {
    isDriversListShown: true,
    selectedDriverId: null,
    selectedDriverOrderId: null,
    testRoutePathLogic: false,
    selectedSuggestedOrderId: null,
    openShipperTrackingFilters: false,
    isShipperOrdersListShown: true,
    selectedOrder: null,
    isShipperOrdersTrackingLoading: false,
    selectedActiveRequest: null,
    selectedShipperTrackingOrder: null,
};

const trackingSlice = createSlice({
    name: 'tracking',
    initialState,
    reducers: {
        setIsDriversListShown: (state, action: PayloadAction<IsDriversListShown>) => {
            state.isDriversListShown = action.payload;
        },
        setSelectedDriverId: (state, action: PayloadAction<SelectedDriverId>) => {
            state.selectedDriverId = action.payload;
        },
        setSelectedDriverOrderId: (state, action: PayloadAction<string | null>) => {
            state.selectedDriverOrderId = action.payload;
        },
        setTestRoutePathLogic: (state, action: PayloadAction<boolean>) => {
            state.testRoutePathLogic = action.payload;
        },
        setSelectedSuggestedOrderId: (state, action: PayloadAction<SelectedSuggestedOrderId>) => {
            state.selectedSuggestedOrderId = action.payload;
        },
        setOpenShipperTrackingFilters: (state, action: PayloadAction<boolean>) => {
            state.openShipperTrackingFilters = action.payload;
        },
        setIsShipperOrdersListShown: (state, action: PayloadAction<boolean>) => {
            state.isShipperOrdersListShown = action.payload;
        },
        setSelectedOrder: (state, action: PayloadAction<SelectedOrder>) => {
            state.selectedOrder = action.payload;
        },
        setIsShipperOrdersTrackingLoading: (state, action: PayloadAction<boolean>) => {
            state.isShipperOrdersTrackingLoading = action.payload;
        },
        setSelectedActiveRequest: (state, action: PayloadAction<SelectedActiveRequest>) => {
            state.selectedActiveRequest = action.payload;
        },
        setSelectedShipperTrackingOrder: (state, action: PayloadAction<SelectedShipperTrackingOrder>) => {
            state.selectedShipperTrackingOrder = action.payload;
        },
        resetSelectedTracking: state => {
            state.selectedShipperTrackingOrder = null;
            state.selectedActiveRequest = null;
            state.selectedDriverId = null;
        },
    },
});

export const trackingActions = trackingSlice.actions;

export const trackingReducer = trackingSlice.reducer;
