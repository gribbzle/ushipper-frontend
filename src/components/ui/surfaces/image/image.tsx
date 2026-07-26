import React, { useContext } from 'react';
import { PhotoView } from 'react-photo-view';

import { EyeIcon } from '@icons';
import { ImageProvider, ImageProviderContext } from '@providers';
import { classname, translateByNamespace } from '@utils';

import { ImageViewProps } from './image.types';

import './image.scss';

const cn = classname('image');
const t = translateByNamespace('common:image');

export const ImageView = ({ src, alt, width, height, className, overlayText, hidePreviewMask, ...props }: ImageViewProps) => {
    const isInsideProvider = useContext(ImageProviderContext);

    const content = (
        <PhotoView src={src} {...props}>
            <div className={cn('container')} style={{ width: `${width}px`, height: `${height}px` }}>
                <img className={className} src={src} alt={alt ?? 'image'} />
                {overlayText ? (
                    <div className={cn('overlay')} style={{ width, height }}>
                        <span>{overlayText}</span>
                    </div>
                ) : (
                    <>
                        {!hidePreviewMask && (
                            <div className={cn('eye-icon')}>
                                <EyeIcon />
                                <span>{t('preview')}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PhotoView>
    );

    return isInsideProvider ? content : <ImageProvider>{content}</ImageProvider>;
};
