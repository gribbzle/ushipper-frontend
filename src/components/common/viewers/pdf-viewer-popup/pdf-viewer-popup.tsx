import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';

import { CancelButton } from '@/components/common/button/CancelButton';
import { DownloadButton } from '@/components/common/button/DownloadButton';
import { Loader } from '@/components/common/loader/loader';
import { Paginate } from '@/components/common/paginate/paginate';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { pdfViewerPopupSelector, viewersActions } from '@store/common/viewers';
import { classname } from '@utils/classname';
import { DownloadFile, downloadFileUsingAnchorElement, downloadFileUsingFetch } from '@utils/files';
import { translateByNamespace } from '@utils/i18n';

import './pdf-viewer-popup.scss';

const cn = classname('pdf-viewer-popup');
const t = translateByNamespace('common:file-uploader');

const checkFileAvailability = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const fileBlobUrl = URL.createObjectURL(blob);

        return fileBlobUrl;
    } catch {
        return null;
    }
};

export const PDFViewerPopup = () => {
    const dispatch = useAppDispatch();
    const { isOpened, url, fileName } = useAppSelector(pdfViewerPopupSelector);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [pageWidth, setPageWidth] = useState<number>(600);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const pageContainerRef = useRef<HTMLDivElement>(null);

    const downloadFile = useMemo<DownloadFile | null>(
        () =>
            url
                ? {
                      url,
                      filename: fileName ?? 'document.pdf',
                  }
                : null,
        [fileName, url],
    );

    const onDocumentLoadSuccess = useCallback((numPages: number | null) => setNumPages(numPages), []);

    const onPageChangeHandler = useCallback((newPage: number) => {
        setPageNumber(newPage);
        setScale(1);
    }, []);

    const handleScaleClick = useCallback(() => setScale(prevScale => (prevScale < 2.0 ? prevScale + 0.25 : 1)), []);

    const handleClosePopup = useCallback(async () => {
        setFileUrl(null);
        setScale(1);
        setPageNumber(1);
        onDocumentLoadSuccess(null);

        dispatch(
            viewersActions.setPDFViewerPopup({
                isOpened: false,
                url: null,
                fileName: null,
            }),
        );
    }, [dispatch, onDocumentLoadSuccess]);

    const handleRightClickDownload = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            if (downloadFile) {
                downloadFileUsingAnchorElement(downloadFile);
            }
        },
        [downloadFile],
    );

    const onPageLoadSuccess = useCallback(() => {
        if (pageContainerRef.current) {
            const containerWidth = pageContainerRef.current.offsetWidth;

            setPageWidth(containerWidth);
        }
    }, []);

    useEffect(() => {
        if (!url) {
            return;
        }

        checkFileAvailability(url).then(fileBlobUrl => {
            if (fileBlobUrl) {
                setFileUrl(fileBlobUrl);

                return;
            }

            if (downloadFile) {
                downloadFileUsingAnchorElement(downloadFile);
                handleClosePopup();

                return;
            }
        });
    }, [downloadFile, handleClosePopup, url]);

    const handleDownload = useCallback(() => {
        if (downloadFile) {
            downloadFileUsingFetch(downloadFile);
        }
    }, [downloadFile]);

    const actions = useMemo(
        () => (
            <>
                <DownloadButton onClick={handleDownload} />
                <CancelButton onClick={handleClosePopup} />
            </>
        ),
        [handleClosePopup, handleDownload],
    );

    const description = useMemo(
        () => (
            <div className={cn('content')} onContextMenu={handleRightClickDownload} ref={pageContainerRef}>
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<Loader />}
                    className={cn('document')}
                    error={<span className={cn('error')}>{t('upload-error')}</span>}
                >
                    <Page
                        pageNumber={pageNumber}
                        className={cn('page', { zoomed: scale > 1 })}
                        scale={scale}
                        onClick={handleScaleClick}
                        width={pageWidth}
                        onLoadSuccess={onPageLoadSuccess}
                    />
                </Document>

                {numPages && numPages > 1 && <Paginate page={pageNumber} lastPage={numPages} onChange={onPageChangeHandler} />}
            </div>
        ),
        [
            fileUrl,
            pageNumber,
            pageWidth,
            scale,
            numPages,
            onDocumentLoadSuccess,
            onPageChangeHandler,
            onPageLoadSuccess,
            handleRightClickDownload,
            handleScaleClick,
        ],
    );

    return <Popup className={cn()} title='' isOpen={isOpened && !!fileUrl} onClose={handleClosePopup} description={description} actions={actions} />;
};
