import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { composeBuilder } from '@utils';

import { Specialization, SpecializationSliceState } from './types';

const initialState: SpecializationSliceState = {
    specializations: [],
};

const specializationsSlice = createSlice({
    name: 'specializations',
    initialState,
    reducers: {
        setSpecializations: (state, action: PayloadAction<Specialization[]>) => {
            state.specializations = action.payload;
        },
    },
    extraReducers: builder => composeBuilder(builder, []),
});

export const specializationsActions = specializationsSlice.actions;

export const specializationsReducer = specializationsSlice.reducer;
