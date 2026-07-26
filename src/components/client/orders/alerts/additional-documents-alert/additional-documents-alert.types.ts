import { FundsTransferStatus } from '@/enums';
import { Attachment } from '@/shared';
import { GetOrderRequestedDocument } from '@store/api/orders-api';

export type AdditionalDocumentsFormValues = {
    [key: string]: File[];
};

export type AdditionalDocumentsAlertProps = {
    fundsTransferStatus?: FundsTransferStatus;
    orderPublicId: string;
    requestsDocuments?: GetOrderRequestedDocument[];
};

export type AdditionalDocumentsAlertRowPropsRowProps = {
    name: string;
    label: string;
    attachment: Attachment | null;
    showFileUploader: boolean;
};
