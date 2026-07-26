import React from 'react';

import { CodCopOrdersActionTag } from '@/components/common';
import { BalanceValue } from '@store/admin';
import { useGetOrderQuery } from '@store/api/orders-api';
import { classname } from '@utils';

const cn = classname('balance-table');

export const OrderPaymentConfirmationCheckTransactionTag = ({ orderPublicId, amount }: { orderPublicId?: string; amount: BalanceValue }) => {
    const { data } = useGetOrderQuery(orderPublicId ?? '', { skip: !orderPublicId });

    if (!data) {
        return null;
    }

    const { publicId, driver, instantTermPaymentType, instantTermDeclinedAt, instantTermPaidAt, instantTermPaymentDeclineReason } = data;

    if (!instantTermPaymentType) {
        return null;
    }

    return (
        <CodCopOrdersActionTag
            className={cn('status')}
            driverPay={Number(amount.amount)}
            publicId={publicId}
            driver={driver}
            instantTermPaymentType={instantTermPaymentType}
            declinedAt={instantTermDeclinedAt}
            paidAt={instantTermPaidAt}
            instantTermPaymentDeclineReason={instantTermPaymentDeclineReason}
        />
    );
};
