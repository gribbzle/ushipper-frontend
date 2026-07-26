import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { FundsTransferStatus } from '@/enums';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:orders-page:notifications');

export const useUpdateFundsTransferStatus = (orderPublicId: string) => {
    const [updateOrder] = usePartiallyUpdateOrderMutation();

    const updateFundsTransferStatus = useCallback(
        (fundsTransferStatus: FundsTransferStatus) => {
            updateOrder({ publicOrderId: orderPublicId, newOrderData: { fundsTransferStatus } })
                .unwrap()
                .then(() => {
                    toast.success<string>(t('success-updated-notification'));
                })
                .catch(() => {
                    toast.error<string>(t('update-error-notification'));
                });
        },
        [updateOrder, orderPublicId],
    );

    return updateFundsTransferStatus;
};
