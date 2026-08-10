import { AttachmentType } from '@/enums/attachment-types-enum';

export type AttachmentsInfoProps = {
    publicId: string;
    type: AttachmentType.BOL | AttachmentType.POD;
};
