import { Attachment } from '@/shared';

export type AttachmentItemProps = {
    attachment?: Attachment | null;
    overlayText?: string;
    hidden?: boolean;
};
