import React, { useMemo } from 'react';

import { Accordion } from '@/components/common/accordion/accordion';
import { ParsedOrderActions } from '@/components/common/parsed-order-actions/parsed-order-actions';
import { ParsedOrderRoute } from '@/components/common/parsed-order-route/parsed-order-route';
import { PaymentInfo } from '@/components/common/payment-info/payment-info';
import { UserOrderStatus } from '@/enums/user-order-status-enum';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { GetOrdersData } from '@store/api/orders-api';
import { Load } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useDriverOrdersTab } from './use-driver-orders-tab';

import './driver-orders-tab.scss';

type Props = {
    title: string;
    fetchedOrders?: Load[];
    view?: 'assigned' | 'picked-up' | 'danger';
    suggestedFilters: LoadBoardFilters | GetOrdersData;
};

const cn = classname('driver-orders-tab');
const t = translateByNamespace('client:drivers-plan:driver-item:orders-tab');

export const DriverOrdersTab = ({ view = 'assigned', title, fetchedOrders, suggestedFilters }: Props) => {
    const { handleOrderClick, selectedOrderId } = useDriverOrdersTab();

    const header = useMemo(() => {
        const count = fetchedOrders?.length ?? 0;

        return (
            <div className={cn('header')}>
                <span>{title}</span>
                <span className={cn('counter', { view })}>{count}</span>
            </div>
        );
    }, [fetchedOrders, title, view]);

    const orders = useMemo(() => {
        return fetchedOrders?.map(order => {
            const { publicId, pickupInformation, deliveryInformation, vehicles, drivingDistance, source, isFlagged, userOrderStatus } = order;

            return (
                <div
                    key={publicId}
                    className={cn('order', {
                        active: selectedOrderId === publicId,
                        flagged: isFlagged,
                        declined: userOrderStatus === UserOrderStatus.DECLINED,
                    })}
                    onClick={() => handleOrderClick(publicId)}
                >
                    <ParsedOrderRoute
                        pickupInformation={pickupInformation}
                        deliveryInformation={deliveryInformation}
                        vehicles={vehicles}
                        drivingDistance={drivingDistance}
                    />
                    <div className={cn('footer')}>
                        <PaymentInfo order={order} inline={true} view='small' />
                        {source !== 'ushipper' && userOrderStatus !== UserOrderStatus.DECLINED && (
                            <ParsedOrderActions order={order} loadBoardFilters={suggestedFilters} />
                        )}
                    </div>
                </div>
            );
        });
    }, [fetchedOrders, selectedOrderId, suggestedFilters, handleOrderClick]);

    const emptyBlock = useMemo(
        () => (
            <div className={cn('order')}>
                <span className={cn('empty')}>{t('no-data')}</span>
            </div>
        ),
        [],
    );

    return (
        <Accordion opened={true} title={header} reverse={true} className={cn('item')}>
            <div className={cn()}>{orders && orders.length > 0 ? orders : emptyBlock}</div>
        </Accordion>
    );
};
