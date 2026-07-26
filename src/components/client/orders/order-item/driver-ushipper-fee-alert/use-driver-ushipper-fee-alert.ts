import { useMemo } from 'react';

import { Load } from '@store/client';
import { translateByNamespace } from '@utils';

import './driver-ushipper-fee-alert.scss';

const t = translateByNamespace('client:orders-page:order-item:driver-alert');

export const useDriverUshipperFeeAlert = ({ driverFeeChargeConfirmed, driverFeeCharge }: Pick<Load, 'driverFeeChargeConfirmed' | 'driverFeeCharge'>) => {
    const driverPay = useMemo(() => (driverFeeCharge ? driverFeeCharge.formatted : t('no-driver-pay')), [driverFeeCharge]);

    const text = useMemo(
        () => t(`${driverFeeChargeConfirmed ? 'has-approved-text' : 'must-approve-text'}`, { driverPay }),
        [driverFeeChargeConfirmed, driverPay],
    );

    return { text };
};
