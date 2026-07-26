import React from 'react';

import { AlertBlock } from '@components';
import { classname, formatToCurrency, translateByNamespace } from '@utils';

import './total-payment-alert.scss';

type Props = {
    payment: number | string;
    delayedPayment?: number | string;
    className?: string;
};
const t = translateByNamespace('client:order:payment-information');
const cn = classname('total-payment-alert');

export const TotalPaymentAlert = ({ payment, delayedPayment, className }: Props) => (
    <AlertBlock className={cn('', [className])}>
        <>
            {t('total-amount-label')}
            <span className={cn('payment-price')}>{formatToCurrency(Number(payment) + Number(delayedPayment))}.</span>
        </>
    </AlertBlock>
);
