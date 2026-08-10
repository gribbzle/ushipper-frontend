import React from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import './payment-broker-fee-alert.scss';

type Props = {
    payment: number | string;
    brokerFee: number | string;
    className?: string;
};
const t = translateByNamespace('client:order:payment-information');
const cn = classname('payment-broker-fee');

export const PaymentBrokerFeeAlert = ({ payment, brokerFee, className }: Props) => {
    const isMeShipper = useMeShipper();

    return (
        <AlertBlock className={cn('', [className])}>
            <>
                {isMeShipper ? t('carrier-will-get-label') : t('you-will-get-label')}{' '}
                <span className={cn('payment-price')}>{formatToCurrency(Number(payment))}</span>{' '}
                {isMeShipper ? t('and-return-label') : t('and-should-return-label')}{' '}
                <span className={cn('payment-price')}>{formatToCurrency(Number(brokerFee))}</span>{' '}
                {isMeShipper ? t('broker-fee-back-label') : t('broker-fee-back-to-shipper-label')}
            </>
        </AlertBlock>
    );
};
