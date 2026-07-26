import React from 'react';

import { AlertBlock } from '@/components';
import { OrderStatus } from '@/enums';
import { translateByNamespace } from '@utils';

const tAlert = translateByNamespace('client:order:payment-information:alert');

export const DriverChargedFeeAlert = ({ orderStatus, fee }: { orderStatus?: OrderStatus; fee?: string }) => {
    if (!orderStatus || !fee) {
        return null;
    }

    return (
        <AlertBlock view='warning'>
            <strong>
                {fee} {tAlert('fee')}
            </strong>{' '}
            <span>{tAlert(orderStatus === OrderStatus.DELIVERED ? 'is-delivered-charged-fee' : 'no-is-delivered-charged-fee')}</span>
        </AlertBlock>
    );
};
