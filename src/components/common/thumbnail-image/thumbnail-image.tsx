import React from 'react';

import { ImageView } from '@ui';
import { classname } from '@utils/classname';

import { ThumbnailImageProps } from './thumbnail-image.types';

import './thumbnail-image.scss';

const cn = classname('thumbnail-image');

export const ThumbnailImage = ({ src, name, size = 32, overlayText, hidden = false }: ThumbnailImageProps) => (
    <div className={cn('', { hidden })} style={{ width: size, height: size }}>
        <ImageView className={cn('image')} src={src} alt={name} width={size} height={size} key={src} hidePreviewMask={true} overlayText={overlayText} />
    </div>
);
