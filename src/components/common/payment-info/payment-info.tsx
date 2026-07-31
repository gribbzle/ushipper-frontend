import React from 'react';

import { Load } from '@store/client';
import { classname } from '@utils/classname';

import { MileCostTooltip } from '../mile-cost-tooltip';

import { usePaymentInfo } from './use-payment-info';

import './payment-info.scss';

type Props = {
    order: Load;
    inline?: boolean;
    view?: 'small';
};

const cn = classname('payment-info');

export const PaymentInfo = ({ order, inline, view }: Props) => {
    const { totalAmount, terms, payment, delayedPayment, delayedTerms, drivingDistance, termsAndMethods, paymentInformation, vehicles, commodities } =
        usePaymentInfo(order, view);

    if (!(payment || delayedPayment)) {
        return null;
    }

    return (
        <div className={cn('', { inline, view })}>
            <div className={cn('wrapper', { inline })}>
                <span className={cn('price')}>{totalAmount}</span>
                <MileCostTooltip drivingDistance={drivingDistance} paymentInformation={paymentInformation} vehicles={vehicles} commodities={commodities} />
            </div>
            {(terms || delayedTerms) && (
                <div className={cn('terms')}>
                    {termsAndMethods.map((item, index) => (
                        <span key={index} className={cn('terms-item')}>
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
