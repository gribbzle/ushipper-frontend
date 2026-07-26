export type PdfViewerPopupPropsState = {
    isOpened: boolean;
    url: string | null;
    fileName?: string | null;
};

export type ImageViewerPopupPropsState = {
    isOpened: boolean;
    url: string | null;
    fileName: string | null;
};

export type ViewersSliceState = {
    pdfViewerPopupProps: PdfViewerPopupPropsState;
    imageViewerPopupProps: ImageViewerPopupPropsState;
};
