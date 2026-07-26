import { AttachmentType } from '@enums';

export type AttachmentsInfoProps = {
    publicId: string;
    type: AttachmentType.BOL | AttachmentType.POD;
};
