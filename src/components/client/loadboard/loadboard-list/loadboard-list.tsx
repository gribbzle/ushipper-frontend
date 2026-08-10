import React from 'react';

import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { UserOrderStatus } from '@/enums/user-order-status-enum';
import { useLoadboardTabSelection } from '@hooks';
import { classname } from '@utils/classname';

import { LoadboardItem, ParsedLoadboardItem } from '../loadboard-item';

import { LoadboardListProps } from './loadboard-list.types';
import { useLoadboardList } from './useLoadboardList';

import './loadboard-list.scss';

const cn = classname('loadboard-list');

export const LoadboardList = ({ orders, loadBoardFilters }: LoadboardListProps) => {
    const isOrderTagged = useLoadboardList();
    const { isAllTab } = useLoadboardTabSelection();

    return (
        <div className={cn()}>
            {orders.map(item => {
                if (item.source === OrderSourcesEnum.USHIPPER) {
                    return <LoadboardItem key={item.publicId} loadBoardFilters={loadBoardFilters} order={item} tagged={isOrderTagged(item.postedAt)} />;
                }

                if (isAllTab && item.userOrderStatus === UserOrderStatus.DECLINED) {
                    return null;
                }

                return <ParsedLoadboardItem key={item.publicId} loadBoardFilters={loadBoardFilters} order={item} tagged={isOrderTagged(item.postedAt)} />;
            })}
        </div>
    );
};
