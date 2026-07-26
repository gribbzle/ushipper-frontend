import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { createCompany, deleteCompany, editCompany, fetchCompanies, fetchCompany } from '@api';
import { AppState } from '@store';
import { companyApi } from '@store/api/company-api';

import { translateByNamespace } from '../../../utils/i18n';

import { companiesFiltersSelector } from './selectors';
import { companiesActions } from './slice';
import { CompaniesFilters, CreateCompanyData, EditCompanyData, FetchedCompanies } from './types';

const t = translateByNamespace('admin:companies-page:create-edit-company-drawer:notifications');

export const fetchCompaniesAction = createAsyncThunk<FetchedCompanies, void>(
    'companies/fetchCompanies',
    async (_data, { rejectWithValue, getState, dispatch }) => {
        const state = getState() as AppState;
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
