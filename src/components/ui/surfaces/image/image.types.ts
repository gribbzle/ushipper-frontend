import { PhotoViewProps as BasePhotoViewProps } from 'react-photo-view/dist/PhotoView';

export type PhotoViewProps = BasePhotoViewProps & {
    hidePreviewMask?: boolean;
};

export type ImageViewProps = Omit<PhotoViewProps, 'children'> & {
    alt?: string | null;
    className?: string;
    overlayText?: string;
};
