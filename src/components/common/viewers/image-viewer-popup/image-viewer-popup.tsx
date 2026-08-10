import React, { useCallback, useMemo } from 'react';

import { CancelButton } from '@/components/common/button/CancelButton';
import { DownloadButton } from '@/components/common/button/DownloadButton';
import { Popup } from '@/components/common/popup/popup';
import { ImageProvider } from '@providers';
import { useAppDispatch, useAppSelector } from '@store';
import { imageViewerPopupSelector, viewersActions } from '@store/common/viewers';
import { ImageView } from '@/components/ui/surfaces/image';
import { classname } from '@utils/classname';
import { downloadFileUsingFetch } from '@utils/files';

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
