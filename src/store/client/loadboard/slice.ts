import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums';
import { SavedLoadBoardFilters } from '@store/api/loadboard-api';
import {
    BetweenPhonesChatDrawerState,
    CallingPopupState,
    CheckingContractPopup,
    LoadboardNoticePopup,
    LoadboardSliceState,
    RequestDrawer,
    SavedSearches,
    SaveSearchDrawer,
} from '@store/client/loadboard';
import { isUshipper } from '@utils';

export const INITIAL_FILTERS: SavedLoadBoardFilters = {
    sortNames: ['post_date', 'pickup_location'],
    sortDirections: [OrderSortingDirection.DESC, OrderSortingDirection.ASC],
    includeCompanyBlacklist: true,
    includeGlobalBlacklist: true,
    distanceOffPath: 50,
    ...(isUshipper && { vehiclesMinCount: 1 }),
};

const initState: LoadboardSliceState = {
    requestDrawer: {
        opened: false,
        title: null,
    },
    saveSearchDrawer: {
        opened: false,
    },
    list: {
        filters: INITIAL_FILTERS,
        isSearchAlongRoute: false,
    },
    savedSearches: {
        searches: [],
    },
    checkingContractPopup: {
        opened: false,
        title: null,
        publicOrderId: null,
        parsedOrders: null,
        orderId: null,
        isChecking: false,
        message: null,
        assignedDriverId: null,
        note: null,
        externalAssignedDriverId: null,
        isSuccess: false,
    },
    loadboardNoticePopup: {
        opened: false,
        description: null,
    },
    callingPopupState: {
        isOpened: false,
        name: null,
        call: null,
        phoneNumber: null,
        orderPublicId: null,
        loadBoardFilters: null,
    },
    isRegisterTwilioSuccess: false,
    isCheckingContractLoading: false,
    betweenPhonesChatDrawerState: {
        isVisible: false,
        externalNumber: null,
    },
};

const loadboardSlice = createSlice({
    name: 'loadboard',
    initialState: initState,
    reducers: {
        setRequestDrawer: (state, action: PayloadAction<RequestDrawer>) => {
            state.requestDrawer = action.payload;
        },
        setListFilters: (state, action: PayloadAction<SavedLoadBoardFilters & { map?: string; filters?: string }>) => {
            state.list.filters = { ...state.list.filters, ...action.payload };
        },
        replaceListFilters: (state, action: PayloadAction<SavedLoadBoardFilters>) => {
            state.list.filters = { ...action.payload };
        },
        setIsSearchAlongRoute: (state, action: PayloadAction<boolean>) => {
            state.list.isSearchAlongRoute = action.payload;
        },
        setSaveSearchDrawer: (state, action: PayloadAction<SaveSearchDrawer>) => {
            state.saveSearchDrawer = action.payload;
        },
        setSavedLoadBoardSearches: (state, action: PayloadAction<SavedSearches>) => {
            state.savedSearches = action.payload;
        },
        setCheckingContractPopup: (state, action: PayloadAction<Partial<CheckingContractPopup>>) => {
            state.checkingContractPopup = { ...state.checkingContractPopup, ...action.payload };
        },
        setLoadboardNoticePopup: (state, action: PayloadAction<LoadboardNoticePopup>) => {
            state.loadboardNoticePopup = action.payload;
        },
        setCallingPopupState: (state, action: PayloadAction<Partial<CallingPopupState>>) => {
            state.callingPopupState = { ...state.callingPopupState, ...action.payload };
        },
        setIsRegisterTwilioSuccess: (state, action: PayloadAction<boolean>) => {
            state.isRegisterTwilioSuccess = action.payload;
        },
        setIsCheckingContractLoading: (state, action: PayloadAction<boolean>) => {
            state.isCheckingContractLoading = action.payload;
        },
        setBetweenPhonesChatDrawer: (state, action: PayloadAction<BetweenPhonesChatDrawerState>) => {
            state.betweenPhonesChatDrawerState = action.payload;
        },
    },
});

export const loadboardActions = loadboardSlice.actions;

export const loadboardReducer = loadboardSlice.reducer;
