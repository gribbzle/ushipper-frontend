import { useMemo } from 'react';

import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { useCodCopOrderOptions } from '@/hooks/order';
import { translateByNamespace } from '@utils/i18n';

import { CodCopOrdersActionTagProps } from './cod-cop-order-action-tag.types';

const hasOptionsSet = new Set([
    InstantTermPaymentType.RECIPIENT_COMPANY,
    InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED,
    InstantTermPaymentType.RECIPIENT_COMPANY_PAID,
]);

const labelMapping: Partial<Record<InstantTermPaymentType, 'pending' | 'declined' | 'paid'>> = {
    [InstantTermPaymentType.RECIPIENT_COMPANY]: 'pending',
    [InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED]: 'declined',
    [InstantTermPaymentType.RECIPIENT_COMPANY_PAID]: 'paid',
};

const t = translateByNamespace('admin:orders-page:cod-cop-order-action-tag');

export const useCodCopOrdersActionTag = ({ publicId, driver, driverPay, instantTermPaymentType }: CodCopOrdersActionTagProps) => {
    const options = useCodCopOrderOptions({ publicId, driver, driverPay, instantTermPaymentType });

    const hasOptions = instantTermPaymentType && hasOptionsSet.has(instantTermPaymentType);

    const label = useMemo(() => t(labelMapping[instantTermPaymentType] ?? 'pending'), [instantTermPaymentType]);

    return { label, options, hasOptions };
};
