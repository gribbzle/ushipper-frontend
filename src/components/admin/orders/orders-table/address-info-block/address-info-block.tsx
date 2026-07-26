import React from 'react';

import { OrderStatus } from '@/enums';
import { getAddress, getScheduledAtInfo } from '@/utils/order';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname } from '@utils';

const cn = classname('orders-table');

type AddressInfoBlockProps = {
    info: OrderDeliveryInformation | OrderPickupInformation;
    status?: OrderStatus;
    pickedUpAt?: string | null;
    deliveredAt?: string | null;
    pickedUpAtTimezone?: string | null;
    deliveredAtTimezone?: string | null;
};

export const AddressInfoBlock = ({ info, status, pickedUpAt, deliveredAt, pickedUpAtTimezone, deliveredAtTimezone }: AddressInfoBlockProps) => {
    const address = getAddress(info);
    const date = 'scheduledPickupAt' in info ? info.scheduledPickupAt : info.scheduledDeliveryAt;
    const time = getScheduledAtInfo({ date, status, pickedUpAt, deliveredAt, pickedUpAtTimezone, deliveredAtTimezone });

    return (
        <div className={cn('cell', { location: true })}>
            <h4 className={cn('column-text')}>{address}</h4>
            {time && <p className={cn('column-sub-text')}> {time}</p>}
        </div>
    );
};
