import React, { useMemo } from 'react';

import { Paper } from '@/components/common';
import { useAppSelector } from '@store';
import { TrackingOrdersByDispatcherData, TrackingOrdersByStatusData } from '@store/api/tracking-api';
import { isShipperOrdersListShownSelector } from '@store/client';
import { classname } from '@utils';

import { ShippersOrdersListContent } from './shipper-orders-list-content';
import { ShippersOrdersListHead } from './shipper-orders-list-head';

import './shipper-orders-list-paper.scss';

export type ShippersOrdersListPaperProps = {
    totalCounter?: number;
    groupedOrders?: (TrackingOrdersByStatusData | TrackingOrdersByDispatcherData)[];
};

const cn = classname('shipper-orders-list-paper');

export const ShippersOrdersListPaper = ({ totalCounter, groupedOrders }: ShippersOrdersListPaperProps) => {
    const isOrdersListShown = useAppSelector(isShipperOrdersListShownSelector);

    const body = useMemo(
        () => (
            <div className={cn('body')}>
                <ShippersOrdersListHead counter={totalCounter} />
                <ShippersOrdersListContent groupedOrders={groupedOrders} />
            </div>
        ),
        [totalCounter, groupedOrders],
    );

    return <Paper className={cn('', { hide: !isOrdersListShown })} body={body} theme='gray' bodyClassName={cn('body')} />;
};
