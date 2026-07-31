import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderRoute, OrderTag } from '@/components/client';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';
import { translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

import './pickup-delivery-info-block.scss';

const cn = classname('pickup-delivery-info-block');

export const PickupDeliveryInfoBlock = ({ order: { pickupInformation, deliveryInformation, status, fundsTransferStatus } }: { order: Load }) => (
    <div className={cn('')}>
        <OrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} inline={true} />
        <div className={cn('statuses')}>
            <OrderTag view={toKebabCase(status)}>{translateOrderStatus(status)}</OrderTag>
            {fundsTransferStatus && <OrderTag view={toKebabCase(fundsTransferStatus)}>{translateFundsTransferStatus(fundsTransferStatus)}</OrderTag>}
        </div>
    </div>
);
