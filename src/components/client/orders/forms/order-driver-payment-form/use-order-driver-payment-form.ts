import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { AttachmentType, InstantTermPaymentType } from '@/enums';
import { useAppDispatch } from '@store';
import { ordersApi, useCreateOrderAttachmentMutation, useRemoveOrderAttachmentMutation, useUpdateOrderMutation } from '@store/api/orders-api';
import { OrderDriverPaymentFormState } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { isOrderCheckDeclined, isOrderCheckDriver } from '@utils/orders/order-payment-helpers';

import { OrderDriverPaymentFormProps } from './order-driver-payment-form.types';

const t = translateByNamespace('client:order:notifications');

export const useOrderDriverPaymentForm = ({
    orderId,
    onAfterFormSubmit,
    file,
    instantTermPaymentType,
    instantTermPaymentMethod,
}: Omit<OrderDriverPaymentFormProps, 'formRef'>) => {
    const [updateOrder] = useUpdateOrderMutation();
    const [createAttachment] = useCreateOrderAttachmentMutation();
    const [removeAttachment] = useRemoveOrderAttachmentMutation();

    const dispatch = useAppDispatch();

    const [hasAttachmentsDropzone, setHasAttachmentsDropzone] = useState<boolean>(false);

    useEffect(() => {
        setHasAttachmentsDropzone(!!file);
    }, [file]);

    const handleFormSubmit = useCallback(
        async (values: OrderDriverPaymentFormState) => {
            try {
                if (orderId) {
                    const { instantTermPaymentType, instantTermPaymentMethod, receipts } = values;
                    const isDriverRecipient = isOrderCheckDriver(instantTermPaymentType);
                    const asset = receipts ? receipts[0] : null;

                    await updateOrder({
                        publicId: orderId,
                        instantTermPaymentType,
                        ...(isDriverRecipient ? {} : { instantTermPaymentMethod }),
                    }).unwrap();

                    if (!isDriverRecipient && asset) {
                        await createAttachment({
                            orderId,
                            file: asset,
                            type: AttachmentType.INSTANT_PAYMENT_DOCUMENT,
                        }).unwrap();
                    }

                    if (file && (isDriverRecipient || file.name !== asset?.name)) {
                        await removeAttachment({ orderId, attachmentId: file.publicId, ...(file.type && { type: file.type }) }).unwrap();
                    }

                    toast.success(t<string>('driver-payment-form-success-notification'));
                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));

                    onAfterFormSubmit();
                    setHasAttachmentsDropzone(false);
                }
            } catch (error) {
                toast.error(t<string>('driver-payment-form-error-notification'));
            }
        },
        [onAfterFormSubmit, dispatch, updateOrder, createAttachment, removeAttachment, file, orderId],
    );

    const initialValues = useMemo(
        () => ({
            instantTermPaymentType: isOrderCheckDeclined(instantTermPaymentType) ? InstantTermPaymentType.RECIPIENT_COMPANY : instantTermPaymentType ?? null,
            instantTermPaymentMethod: instantTermPaymentMethod ?? null,
        }),
        [instantTermPaymentType, instantTermPaymentMethod],
    );

    return { handleFormSubmit, hasAttachmentsDropzone, initialValues, setHasAttachmentsDropzone };
};
