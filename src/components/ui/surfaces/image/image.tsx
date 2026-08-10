import React, { useContext } from 'react';
import { PhotoView } from 'react-photo-view';

import { ImageProvider, ImageProviderContext } from '@/providers/ImageProvider';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ImageViewProps } from './image.types';

import './image.scss';
import EyeIcon from '@/assets/icons/eye.svg';

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
