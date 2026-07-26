import React, { useCallback, useMemo } from 'react';

import { CancelButton, DownloadButton, Popup } from '@/components/common';
import { ImageProvider } from '@providers';
import { useAppDispatch, useAppSelector } from '@store';
import { imageViewerPopupSelector, viewersActions } from '@store/common/viewers';
import { ImageView } from '@ui';
import { classname, downloadFileUsingFetch } from '@utils';

import './image-viewer-popup.scss';

const cn = classname('image-viewer-popup');

export const ImageViewerPopup = () => {
    const dispatch = useAppDispatch();
    const { isOpened, url, fileName } = useAppSelector(imageViewerPopupSelector);

    const handleClosePopup = useCallback(async () => {
        dispatch(
            viewersActions.setImageViewerPopup({
                isOpened: false,
                url: null,
                fileName: null,
            }),
        );
    }, [dispatch]);

    const handleDownload = useCallback(() => {
        if (url) {
            downloadFileUsingFetch({ url, filename: fileName ?? 'image' });
        }
    }, [url, fileName]);

    const actions = useMemo(
        () => (
            <>
                <DownloadButton onClick={handleDownload} />
                <CancelButton onClick={handleClosePopup} />
            </>
        ),
        [handleClosePopup, handleDownload],
    );

    if (!url) {
        return null;
    }

    return (
        <Popup
            className={cn()}
            onTop={true}
            size='large'
            title=''
            isOpen={isOpened}
            onClose={handleClosePopup}
            description={
                <ImageProvider>
                    <ImageView src={url} alt={fileName} className={cn('image')} />
                </ImageProvider>
            }
            actions={actions}
        />
    );
};
