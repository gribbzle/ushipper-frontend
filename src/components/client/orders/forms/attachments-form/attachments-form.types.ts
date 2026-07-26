import { Attachment } from '@/shared';
import { AttachmentType } from '@enums';

export type AttachmentsShowBodyProps = {
    orderId: string;
    disabled?: boolean;
};

export type AttachmentsFormProps = {
    orderId: string | null;
    disabled?: boolean;
};

export type FieldOrEmptyZoneProps = {
    disabled: boolean;
    name: string;
    label?: string;
    emptyLabel: string;
    title?: string;
    isMultiFiles?: boolean;
    isRequired?: boolean;
    className?: string;
};

export type AttachmentDropzoneProps = {
    label: string;
    type?: AttachmentType;
    onDrop?: (acceptedFiles: File[], type?: AttachmentType) => void;
    onDeleteFile: (file: Attachment) => void;
    files: Attachment[];
    otherFiles?: Attachment[];
    isMultiFiles?: boolean;
    disabled?: boolean;
};

export type AttachmentSectionProps = {
    orderId: string;
    type?: AttachmentType;
    title?: string;
    label: string;
    isMultiFiles?: boolean;
    disabled: boolean;
    initialDisplayCount?: number;
    className?: string;
};
