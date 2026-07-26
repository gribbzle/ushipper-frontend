import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { FundsTransferStatus } from '@/enums';
import { useAppDispatch } from '@store';
import { ordersApi, useCreateOrderRequestedDocumentsMutation, usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { handleError, removeFieldPrefix, translateByNamespace } from '@utils';

import { AdditionalDocumentsAlertProps, AdditionalDocumentsFormValues } from './additional-documents-alert.types';

const t = translateByNamespace('client:orders-page:additional-documents-alert');

export const useAdditionalDocumentsAlert = ({ fundsTransferStatus, orderPublicId, requestsDocuments = [] }: AdditionalDocumentsAlertProps) => {
    const [createAttachments] = useCreateOrderRequestedDocumentsMutation();
    const [updateOrder] = usePartiallyUpdateOrderMutation();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const onSubmit = useCallback(
        async (values: AdditionalDocumentsFormValues) => {
            try {
                setIsLoading(true);

                const renamedFields: AdditionalDocumentsFormValues = removeFieldPrefix(values);

                const attachmentPromises = Object.entries(renamedFields).flatMap(([key, files]) =>
                    files
                        .map(file => {
                            const requestId = requestsDocuments?.find(doc => doc.title === key)?.id;

                            if (requestId) {
                                return createAttachments({
                                    orderId: orderPublicId,
                                    requestId,
                                    file,
                                })
                                    .unwrap()
                                    .catch(() => ({ key, status: 'rejected' }));
                            }

                            return null;
                        })
                        .filter(Boolean),
                );

                const results = await Promise.allSettled(attachmentPromises);

                const rejectedKeys = results
                    .filter(result => result.status === 'fulfilled' && (result as any).value.status === 'rejected')
                    .map(result => (result as any).value.key);

                if (rejectedKeys.length > 0) {
                    toast.error<string>(t('documents-upload-failed-notification', { documents: rejectedKeys.join(', ') }));
                    dispatch(ordersApi.util.invalidateTags([{ type: 'RequestedDocuments', id: orderPublicId }]));
                    setIsLoading(false);

                    return;
                }

                const missingDocuments = requestsDocuments
                    .filter(doc => !doc.attachment && !renamedFields[doc.title]?.length)
                    .map(doc => doc.title)
                    .join(', ');

                if (missingDocuments) {
                    toast.error<string>(t('should-documents-upload-notification', { documents: missingDocuments }));
                } else {
                    await updateOrder({
                        publicOrderId: orderPublicId,
                        newOrderData: {
                            fundsTransferStatus: FundsTransferStatus.DOCUMENTS_SUBMITTED,
                        },
                    }).unwrap();

                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }]));
                    toast.success<string>(t('upload-documents-success'));
                }

                dispatch(ordersApi.util.invalidateTags([{ type: 'RequestedDocuments', id: orderPublicId }]));
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [createAttachments, dispatch, updateOrder, requestsDocuments, orderPublicId],
    );

    const isRequestingDocuments = useMemo(
        () => fundsTransferStatus === FundsTransferStatus.DOCUMENTS_REQUESTED && !!requestsDocuments?.length,
        [fundsTransferStatus, requestsDocuments?.length],
    );

    return { onSubmit, isLoading, isRequestingDocuments };
};
