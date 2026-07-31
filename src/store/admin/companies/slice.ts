import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums';
import { createCompany, deleteCompany, editCompany, fetchCompanies, fetchCompany } from '@api';
import { companyApi } from '@store/api/company-api';
import { CompanyTotalRating } from '@store/api/company-rating-types';
import { composeBuilder, requestInitial } from '@utils/redux';

import { translateByNamespace } from '../../../utils/i18n';

import { companiesFiltersSelector } from './selectors';
import {
    CompaniesFilters,
    CompaniesSliceState,
    CreateCompanyData,
    CreateEditCompanyDrawerState,
    DeleteCompanyPopupState,
    EditCompanyData,
    FetchedCompanies,
} from './types';

const t = translateByNamespace('admin:companies-page:create-edit-company-drawer:notifications');

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

export const fetchCompaniesAction = createAsyncThunk<FetchedCompanies, void>(
    'companies/fetchCompanies',
    async (_data, { rejectWithValue, getState, dispatch }) => {
        const state = getState() as any;
        const filters = companiesFiltersSelector(state) as CompaniesFilters;

        try {
            const result = await fetchCompanies(filters);

            dispatch(companiesActions.setFilters({ lastPage: result.meta.lastPage }));

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const createCompanyFormSubmit = createAsyncThunk<void, CreateCompanyData>(
    'companies/createEditCompanyFormSubmit',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            await createCompany(data);

            toast.success<string>(t('create-company-success'));

            dispatch(
                companiesActions.setCreateEditCompanyDrawerProps({
                    isVisible: false,
                    mode: null,
                    companyId: null,
                }),
            );

            dispatch(fetchCompaniesAction());
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const editCompanyFormSubmit = createAsyncThunk<void, { companyId: string; data: EditCompanyData }>(
    'companies/editCompanyFormSubmit',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await editCompany(data.companyId, data.data);

            toast.success<string>(t('update-company-success'));

            dispatch(
                companiesActions.setCreateEditCompanyDrawerProps({
                    isVisible: false,
                    mode: null,
                    companyId: null,
                }),
            );

            dispatch(fetchCompaniesAction());
        } catch (error) {
            toast.error<string>(t('update-company-error'));

            return rejectWithValue(error);
        }
    },
);

export const fetchCompanyAction = createAsyncThunk<void, string>('companies/fetchCompany', async (companyPublicId, { rejectWithValue }) => {
    try {
        return await fetchCompany(companyPublicId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteCompanyAction = createAsyncThunk<void, string>('companies/deleteCompany', async (companyPublicId, { rejectWithValue, dispatch }) => {
    try {
        const result = await deleteCompany(companyPublicId);

        dispatch(
            companiesActions.setDeleteCompanyPopupProps({
                isVisible: false,
                companyId: null,
                companyName: null,
            }),
        );
        dispatch(
            companiesActions.setCreateEditCompanyDrawerProps({
                isVisible: false,
                companyId: null,
                mode: null,
            }),
        );
        dispatch(companyApi.util.invalidateTags([{ type: 'Companies', id: 'LIST' }]));

        toast.success<string>(t('delete-company-success'));

        return result;
    } catch (error) {
        toast.error<string>(t('delete-company-error'));

        return rejectWithValue(error);
    }
});

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
