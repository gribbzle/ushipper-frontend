import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { createEditCarModel, deleteCarModel, fetchCarMakers, fetchCarModel, fetchCarModels, fetchCarModelStatuses } from '@api';
import { CarMaker } from '@store/admin/car-makers-settings/types';
import { composeBuilder, PaginatedData, requestInitial } from '@utils/redux';

import { carModelsFiltersSelector, createEditCarModelDrawerPropsSelector, deleteCarModelPopupPropsSelector } from './selectors';
import { CarModelsFilters, CarModelsSettingsSliceState, CreateEditCarModelDrawerState, DeleteCarModelPopupState } from './types';

const initialState: CarModelsSettingsSliceState = {
    fetchCarModels: requestInitial(),
    filters: {
        page: 1,
        perPage: 20,
        lastPage: null,
        modelName: null,
        makerId: null,
        status: null,
        orderName: null,
        orderDirection: null,
    },
    filterSearchCarMakers: requestInitial(),
    fetchCarModelStatuses: requestInitial(),

    createEditCarModelDrawer: {
        isVisible: false,
        mode: null,
        carModelId: null,
        carModelName: null,
    },
    createEditCarModel: requestInitial(),
    fetchCarModel: requestInitial(),
    crudSearchCarMakers: requestInitial(),

    deleteCarModelPopup: {
        isVisible: false,
        carModelId: null,
        carModelName: null,
    },
    deleteCarModel: requestInitial(),
};

export const fetchCarModelsAction = createAsyncThunk<any, void>('carModelsSettings/fetchCarModels', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as any;
    const filters = carModelsFiltersSelector(state) as CarModelsFilters;

    try {
        const result = await fetchCarModels(filters);

        dispatch(carModelsSettingsActions.setFilters({ lastPage: result.lastPage, to: result.to, from: result.from, total: result.total }));

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createEditCarModelFormSubmit = createAsyncThunk<void, any>(
    'carModelsSettings/createEditCarModelFormSubmit',
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState() as any;
            const { mode, carModelId } = createEditCarModelDrawerPropsSelector(state);

            data.id = carModelId;

            const result = await createEditCarModel(mode as 'create' | 'edit', data);

            dispatch(fetchCarModelsAction());
            dispatch(
                carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                    isVisible: false,
                    mode: null,
                    carModelId: null,
                    carModelName: null,
                }),
            );

            toast(`Car Model has been successfully ${mode === 'create' ? 'created' : 'updated'}`);

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchCarModelAction = createAsyncThunk<any, number>('carModelsSettings/fetchCarModel', async (data, { rejectWithValue }) => {
    try {
        return await fetchCarModel(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteCarModelAction = createAsyncThunk<any, void>('carModelsSettings/deleteCarModel', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as any;
    const { carModelId } = deleteCarModelPopupPropsSelector(state) as DeleteCarModelPopupState;

    try {
        const result = await deleteCarModel(carModelId as number);

        dispatch(
            carModelsSettingsActions.setDeleteCarModelPopupProps({
                isVisible: false,
                carModelId: null,
                carModelName: null,
            }),
        );
        dispatch(
            carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                isVisible: false,
                mode: null,
                carModelId: null,
                carModelName: null,
            }),
        );
        dispatch(fetchCarModelsAction());

        toast('Car Model has been successfully deleted');

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const crudSearchCarMakersAction = createAsyncThunk<any, string | null>(
    'carModelsSettings/crudSearchCarMakers',
    async (searchQuery, { rejectWithValue }) => {
        try {
            return await fetchCarMakers({
                page: 1,
                name: searchQuery,
                perPage: 20,
                lastPage: null,
                orderDirection: OrderSortingDirection.ASC,
                orderName: 'name',
                status: 'active',
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const filterSearchCarMakersAction = createAsyncThunk<PaginatedData<CarMaker[]>, string | null>(
    'carModelsSettings/filterSearchCarMakers',
    async (searchQuery, { rejectWithValue }) => {
        try {
            return await fetchCarMakers({
                page: 1,
                name: searchQuery,
                perPage: 20,
                lastPage: null,
                orderDirection: OrderSortingDirection.ASC,
                orderName: 'name',
                status: null,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchCarModelStatusesAction = createAsyncThunk<any, void>('carModelsSettings/fetchCarModelStatuses', async (searchQuery, { rejectWithValue }) => {
    try {
        return await fetchCarModelStatuses();
    } catch (error) {
        return rejectWithValue(error);
    }
});

const carModelsSettingsSlice = createSlice({
    name: 'carModelsSettings',
    initialState,
    reducers: {
        setCreateEditCarModelDrawerProps: (state, action: PayloadAction<CreateEditCarModelDrawerState>) => {
            state.createEditCarModelDrawer = action.payload;
        },
        setDeleteCarModelPopupProps: (state, action: PayloadAction<DeleteCarModelPopupState>) => {
            state.deleteCarModelPopup = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<CarModelsFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetStateSlice: () => {
            return { ...initialState };
        },
        resetCrudSearchCarMakers: state => {
            state.crudSearchCarMakers = requestInitial();
        },
    },
    extraReducers: builder =>
        composeBuilder(builder, [
            fetchCarModelsAction,
            fetchCarModelAction,
            deleteCarModelAction,
            crudSearchCarMakersAction,
            fetchCarModelStatusesAction,
            filterSearchCarMakersAction,
        ]),
});

export const carModelsSettingsActions = carModelsSettingsSlice.actions;

export const carModelsSettingsReducer = carModelsSettingsSlice.reducer;
