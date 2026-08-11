import React, { useCallback, useMemo, useState } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { Attachment } from '@/shared/types';
import { AttachmentType } from '@/enums/attachment-types-enum';
import { useAppDispatch } from '@store';
import { useCreateOrderAttachmentMutation, useGetOrderAttachmentsQuery } from '@store/api/orders-api';
import { ordersActions } from '@store/client';

import { AttachmentsDropzone } from './attachments-dropzone';
import { AttachmentSectionProps } from './attachments-form.types';

export const AttachmentsSection = ({ orderId, type, title, label, isMultiFiles = true, disabled, initialDisplayCount, className }: AttachmentSectionProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [createAttachments] = useCreateOrderAttachmentMutation();
    const dispatch = useAppDispatch();

    const onDrop = useCallback(
        async (acceptedFiles: File[], type?: AttachmentType) => {
            const promises: Array<Promise<Attachment>> = [];

            acceptedFiles.forEach(file => {
                promises.push(
                    createAttachments({
                        orderId: orderId,
                        file: file,
                        type: type ?? AttachmentType.DEFAULT,
                    }).unwrap(),
                );
            });

            await Promise.all(promises);

            setFiles([...files, ...acceptedFiles]);
        },
        [createAttachments, files, orderId],
    );

    // If type is specified, execute one query
    const { data: singleTypeData } = useGetOrderAttachmentsQuery({ orderId, type }, { skip: !orderId || !type });

    // If type is not specified, execute three queries for default types
    const { data: defaultDocuments } = useGetOrderAttachmentsQuery({ orderId, type: AttachmentType.DEFAULT }, { skip: !orderId || !!type });
    const { data: paymentDocuments } = useGetOrderAttachmentsQuery({ orderId, type: AttachmentType.PAYMENT_DOCUMENT }, { skip: !orderId || !!type });

    const { data: instantPaymentDocuments } = useGetOrderAttachmentsQuery(
        { orderId, type: AttachmentType.INSTANT_PAYMENT_DOCUMENT },
        { skip: !orderId || !!type },
    );

    const attachments = useMemo((): Attachment[] => {
        if (type) {
            return singleTypeData?.attachments || [];
        }

        return [...(defaultDocuments?.attachments || []), ...(instantPaymentDocuments?.attachments || []), ...(paymentDocuments?.attachments || [])];
    }, [singleTypeData, defaultDocuments, instantPaymentDocuments, paymentDocuments, type]);

    const initAttachmentsItems = useMemo((): Attachment[] => {
        if (initialDisplayCount) {
            return attachments.slice(0, initialDisplayCount);
        }

        return attachments;
    }, [initialDisplayCount, attachments]);

    const otherItems = useMemo((): Attachment[] => {
        if (initialDisplayCount) {
            return attachments.slice(initialDisplayCount);
        }

        return [];
    }, [initialDisplayCount, attachments]);

    const openConfirmationModal = useCallback(
        (attachment: Attachment) => {
            dispatch(ordersActions.setDeleteOrderAttachmentPopupProps({ isVisible: true, attachmentToDelete: attachment, orderPublicId: orderId }));
        },
        [dispatch, orderId],
    );

    if (title) {
        return (
            <OrderItemInfoColumn title={title} className={className}>
                <AttachmentsDropzone
                    files={initAttachmentsItems}
                    otherFiles={otherItems}
                    label={label}
                    type={type}
                    onDeleteFile={file => openConfirmationModal(file)}
                    disabled={disabled}
                    isMultiFiles={isMultiFiles}
                    onDrop={onDrop}
                />
            </OrderItemInfoColumn>
        );
    }

    return (
        <AttachmentsDropzone
            files={initAttachmentsItems}
            otherFiles={otherItems}
            label={label}
            type={type}
            onDeleteFile={file => openConfirmationModal(file)}
            disabled={disabled}
            isMultiFiles={isMultiFiles}
            onDrop={onDrop}
        />
    );
};
