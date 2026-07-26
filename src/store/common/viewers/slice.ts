import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ImageViewerPopupPropsState, PdfViewerPopupPropsState, ViewersSliceState } from './types';

const initialState: ViewersSliceState = {
    pdfViewerPopupProps: {
        isOpened: false,
        url: null,
        fileName: null,
    },
    imageViewerPopupProps: {
        isOpened: false,
        url: null,
        fileName: null,
    },
};

const viewersSlice = createSlice({
    name: 'viewers',
    initialState,
    reducers: {
        setPDFViewerPopup: (state, action: PayloadAction<PdfViewerPopupPropsState>) => {
            state.pdfViewerPopupProps = action.payload;
        },
        setImageViewerPopup: (state, action: PayloadAction<ImageViewerPopupPropsState>) => {
            state.imageViewerPopupProps = action.payload;
        },
    },
});

export const viewersActions = viewersSlice.actions;

export const viewersReducer = viewersSlice.reducer;
