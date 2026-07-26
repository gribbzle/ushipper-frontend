import { useMemo } from 'react';

import { calculateTotalPayment } from '@/utils/payment';

import { OrderItemHeaderProps } from '../types';

export const useOrderTotalAmount = ({ paymentInformation }: Pick<OrderItemHeaderProps, 'paymentInformation'>) => {
    const totalAmount = useMemo(() => calculateTotalPayment(paymentInformation), [paymentInformation]);

    return { totalAmount };
};
