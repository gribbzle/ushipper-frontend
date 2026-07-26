import React from 'react';

import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/common';
import { classname, translateByNamespace } from '@utils';

import { DriverOrdersTab } from '../driver-orders-tab';

import { useDriverOrdersBlock } from './use-driver-orders-block';

import './driver-orders-block.scss';

type Props = {
    className?: string;
    suggestedOrders?: Load[];
    suggestedFilters: LoadBoardFilters;
    driverId: string;
};

const cn = classname('driver-orders-block');
const t = translateByNamespace('client:drivers-plan:driver-item:orders-tab');

export const DriverOrdersBlock = ({ className, suggestedOrders, suggestedFilters, driverId }: Props) => {
    const { assignedOrdersFilters, assignedOrders, pickedUpOrdersFilters, pickedUpdOrders } = useDriverOrdersBlock(driverId);

    return (
        <div className={cn('', [className])}>
            <DriverOrdersTab title={t('suggested')} fetchedOrders={suggestedOrders} view='danger' suggestedFilters={suggestedFilters} />
            <DriverOrdersTab title={t('requested')} fetchedOrders={[]} view='danger' suggestedFilters={suggestedFilters} />
            <DriverOrdersTab title={t('assigned')} fetchedOrders={assignedOrders} suggestedFilters={assignedOrdersFilters} />
            <DriverOrdersTab title={t('picked-up')} fetchedOrders={pickedUpdOrders} view='picked-up' suggestedFilters={pickedUpOrdersFilters} />
        </div>
    );
};
