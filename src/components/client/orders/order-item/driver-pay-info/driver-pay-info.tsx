import React from 'react';

import { classname, translateByNamespace } from '@utils';

import { OrderItemHeaderProps } from '../types';

import { useDriverPayInfo } from './use-driver-pay-info';

import './driver-pay-info.scss';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');

const cn = classname('driver-pay-info');

export type DriverPayInfoProps = Pick<
    OrderItemHeaderProps,
    'fundsTransferStatus' | 'paymentInformation' | 'status' | 'driverFeeCharge' | 'driverDelayedPayment' | 'instantTermPaymentType'
>;

export const DriverPayInfo = ({
    fundsTransferStatus,
    driverFeeCharge,
    driverDelayedPayment,
    status,
    paymentInformation,
    instantTermPaymentType,
}: DriverPayInfoProps) => {
    const { showDriverPay, driverPayStatusText, isDangerStatus, driverPay, showDriverPayStatusText } = useDriverPayInfo({
        status,
        fundsTransferStatus,
        driverFeeCharge,
        driverDelayedPayment,
        paymentInformation,
        instantTermPaymentType,
    });

    return showDriverPay ? (
        <div className={cn('', { danger: isDangerStatus })}>
            <span className={cn('value')}>{translateOrderItem('driver-pay', { pay: driverPay })} </span>
            {showDriverPayStatusText && <span className={cn('value')}>({driverPayStatusText})</span>}
        </div>
    ) : null;
};
