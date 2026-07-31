type AppState = {
    common: {
        viewers: any;
    };
};

const viewersSelector = (state: AppState) => state.common.viewers;

export const pdfViewerPopupSelector = (state: AppState) => viewersSelector(state).pdfViewerPopupProps;

export const imageViewerPopupSelector = (state: AppState) => viewersSelector(state).imageViewerPopupProps;
