import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums';
import { CompanyTotalRating } from '@store/api/company-api';
import { composeBuilder, requestInitial } from '@utils';

import { createCompanyFormSubmit, deleteCompanyAction, fetchCompaniesAction, fetchCompanyAction } from './actions';
import { CompaniesFilters, CompaniesSliceState, CreateEditCompanyDrawerState, DeleteCompanyPopupState } from './types';

const initialState: CompaniesSliceState = {
    fetchCompanies: requestInitial(),
    filters: {
        page: 1,
        perPage: 20,
        email: null,
        name: null,
        phone: null,
        status: null,
        type: null,
        lastPage: null,
        orderName: 'name',
        orderDirection: OrderSortingDirection.ASC,
    },

    createEditCompanyFormSubmit: requestInitial(),
    fetchCompany: requestInitial(),
    companyTotalRating: null,

    createEditCompanyDrawer: {
        isVisible: false,
        mode: null,
        companyId: null,
    },

    deleteCompanyPopup: {
        isVisible: false,
        companyId: null,
        companyName: null,
    },
    deleteCompany: requestInitial(),
};

const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        setCreateEditCompanyDrawerProps: (state, action: PayloadAction<CreateEditCompanyDrawerState>) => {
            state.createEditCompanyDrawer = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<CompaniesFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setDeleteCompanyPopupProps: (state, action: PayloadAction<DeleteCompanyPopupState>) => {
            state.deleteCompanyPopup = action.payload;
        },
        setCompanyRating: (state, action: PayloadAction<CompanyTotalRating>) => {
            state.companyTotalRating = action.payload;
        },
    },
    extraReducers: builder => composeBuilder(builder, [fetchCompaniesAction, createCompanyFormSubmit, fetchCompanyAction, deleteCompanyAction]),
});

export const companiesActions = companiesSlice.actions;

export const companiesReducer = companiesSlice.reducer;
