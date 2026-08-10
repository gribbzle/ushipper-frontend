import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { useDeleteOrderFlagMutation } from '@store/api/orders-api';
import { translateByNamespace } from '@utils/i18n';

import { OrderItemHeaderProps } from '../types';

import { useOrderTotalAmount } from './use-order-total-amount';

const translateOrderNotification = translateByNamespace('client:order');

export const useOrderItemHeader = ({ paymentInformation, orderPublicId }: Pick<OrderItemHeaderProps, 'paymentInformation' | 'orderPublicId'>) => {
    const [deleteOrderFlag] = useDeleteOrderFlagMutation();
    const isCarrier = useMeCarrier();

    const isPartner = useIsPartnerCompany();
    const { delayedTerms, terms } = paymentInformation;

    const handleUnFlaggedClick = useCallback(async () => {
        if (orderPublicId) {
            try {
                await deleteOrderFlag({ publicOrderId: orderPublicId }).unwrap();
                toast.success(translateOrderNotification<string>('unflagged-order-success-notification'));
            } catch {
                toast.error(translateOrderNotification<string>('update-error-notification'));
            }
        }
    }, [deleteOrderFlag, orderPublicId]);

    const { totalAmount } = useOrderTotalAmount({ paymentInformation });

    return { totalAmount, delayedTerms, terms, isPartner, isCarrier, handleUnFlaggedClick };
};
