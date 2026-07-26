import React from 'react';

import { TrackingOrderStatus } from '@/enums';
import { useAppSelector } from '@store';
import { TrackingOrdersByDispatcherData } from '@store/api/tracking-api';
import { isShipperOrdersTrackingLoadingSelector } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import { ManagerInfo } from '../../manager-info';
import { ShipperOrdersTab } from '../shipper-tracking-orders-tab';

import './shipper-orders-list-content.scss';

const cn = classname('shipper-orders-list-content');
const t = translateByNamespace('client:tracking-page:shipper-orders-list-paper');

type ShippersOrdersListByManagerProps = {
    groupedOrders: TrackingOrdersByDispatcherData[];
};

export const ShippersOrdersListByManager = ({ groupedOrders }: ShippersOrdersListByManagerProps) => {
    const isLoading = useAppSelector(isShipperOrdersTrackingLoadingSelector);

    if (!groupedOrders?.length && !isLoading) {
        return <p className={cn('empty')}>{t('no-orders-for-managers')}</p>;
    }

    return (
        <>
            {groupedOrders.map((group, index) => {
                const { dispatcher, orders } = group;
                const { publicId, name, nickname, avatar } = dispatcher;

                return (
                    <ShipperOrdersTab
                        key={publicId}
                        title={<ManagerInfo name={name} nickName={nickname} avatarUrl={avatar?.url} />}
                        showEllipseIcon={false}
                        view={TrackingOrderStatus.NOT_DISPATCHED}
                        opened={index === 0}
                        orders={orders}
                    />
                );
            })}
        </>
    );
};
