import React from 'react';

import { AlertBlock } from '@components';
import { Load } from '@store/client';
import { classname } from '@utils';

import { useDriverUshipperFeeAlert } from './use-driver-ushipper-fee-alert';

import './driver-ushipper-fee-alert.scss';

const cn = classname('driver-ushipper-fee-alert');

export const DriverUshipperFeeAlert = ({
    driverFeeChargeConfirmed,
    driverFeeCharge,
}: Pick<Load, 'driverFeeChargeConfirmed' | 'driverFeeCharge' | 'driverDelayedPayment'>) => {
    const { text } = useDriverUshipperFeeAlert({ driverFeeChargeConfirmed, driverFeeCharge });

    return (
        <AlertBlock className={cn()} view={`${driverFeeChargeConfirmed ? 'success' : 'warning'}`}>
            {text}
        </AlertBlock>
    );
};
