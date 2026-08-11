import { Attachment } from '@/shared/types';

export type AttachmentItemProps = {
    attachment?: Attachment | null;
    overlayText?: string;
    hidden?: boolean;
};
