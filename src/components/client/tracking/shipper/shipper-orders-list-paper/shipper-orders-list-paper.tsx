import React, { useMemo } from 'react';

import { Paper } from '@/components/common/paper/paper';
import { useAppSelector } from '@store';
import { isShipperOrdersListShownSelector } from '@store/client';
import { classname } from '@utils/classname';

import { ShippersOrdersListContent } from './shipper-orders-list-content';
import { ShippersOrdersListHead } from './shipper-orders-list-head';
import { ShippersOrdersListPaperProps } from './shipper-orders-list-paper.types';

import './shipper-orders-list-paper.scss';

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
