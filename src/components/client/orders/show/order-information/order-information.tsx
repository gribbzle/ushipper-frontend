import React, { useCallback, useMemo } from 'react';

import { OrderSetDispatcherDrawer } from '@/components/client/orders/drawers/order-set-dispatcher-drawer/order-set-dispatcher-drawer';
import { OrderSetDriverDrawer } from '@/components/client/orders/drawers/order-set-driver-drawer/order-set-driver-drawer';
import { UserInfo } from '@/components/client/orders/show/order-information/user-info';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { OrderSourcesEnum, UserRoleGroup, UserRoleType } from '@/enums';
import { useCanManageOrder } from '@/hooks/order';
import { useIsPartnerCompany, useMeDriverRelated, useUserRoleGroup } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import {
    orderCarrierOrderSelector,
    orderDispatcherSelector,
    orderDriverSelector,
    orderPublicIdSelector,
    ordersActions,
    orderSelector,
    orderShipperOrderSelector,
} from '@store/client';
import { classname } from '@utils/classname';

import { CDStatusInfo } from './cd-status-info';
import { OrderCreatedInfo } from './order-created-info';
import { OrderPriceInfo } from './order-price-info';
import { OrderStatusInfo } from './order-status-info';
import { UserCompanyInfo } from './user-company-info';

import './order-information.scss';

const cn = classname('order-information');

export const OrderInformation = () => {
    const dispatch = useAppDispatch();
    const orderId = useAppSelector(orderPublicIdSelector);
    const driver = useAppSelector(orderDriverSelector);
    const dispatcher = useAppSelector(orderDispatcherSelector);
    const shipperOrder = useAppSelector(orderShipperOrderSelector);
    const carrierOrder = useAppSelector(orderCarrierOrderSelector);
    const order = useAppSelector(orderSelector);

    const shipperCompany = shipperOrder?.company;
    const carrierCompany = carrierOrder?.company;

    const userRoleGroup = useUserRoleGroup();
    const isMePartner = useIsPartnerCompany();
    const isDriver = useMeDriverRelated();
    const canPerformActions = useCanManageOrder();

    const handleSetDriverDrawerOpen = useCallback(() => {
        if (orderId) {
            dispatch(
                ordersActions.setDriverDrawerProps({
                    isVisible: true,
                    orderId,
                }),
            );
        }
    }, [dispatch, orderId]);

    const handleSetDispatcherDrawerOpen = useCallback(() => {
        if (orderId) {
            dispatch(
                ordersActions.setDispatcherDrawerProps({
                    isVisible: true,
                    orderId,
                }),
            );
        }
    }, [dispatch, orderId]);

    const body = useMemo(
        () => (
            <>
                <div className={cn('wrapper', { parsed: !!order?.externalContractChangedAt })}>
                    <OrderPriceInfo />
                    {order && <OrderStatusInfo order={order} />}
                    <CDStatusInfo changedAt={order?.externalContractChangedAt} />
                    <OrderCreatedInfo />
                </div>
                <div className={cn('wrapper', { parsed: !!order?.externalContractChangedAt })}>
                    {userRoleGroup !== UserRoleGroup.SHIPPERS && (
                        <>
                            <UserInfo
                                user={driver}
                                type={UserRoleType.CARRIER_DRIVER}
                                onDrawerOpen={canPerformActions ? handleSetDriverDrawerOpen : undefined}
                                showBalance={isMePartner && !isDriver ? true : false}
                            />
                            {canPerformActions && <OrderSetDriverDrawer />}
                        </>
                    )}
                    <UserInfo
                        user={dispatcher}
                        type={userRoleGroup === UserRoleGroup.SHIPPERS ? UserRoleType.SHIPPER_DISPATCHER : UserRoleType.CARRIER_DISPATCHER}
                        onDrawerOpen={canPerformActions ? handleSetDispatcherDrawerOpen : undefined}
                    />
                    {canPerformActions && <OrderSetDispatcherDrawer />}
                    {order?.source === OrderSourcesEnum.USHIPPER && (
                        <>
                            {shipperCompany && <UserCompanyInfo company={shipperCompany} />}
                            {carrierCompany && <UserCompanyInfo company={carrierCompany} />}
                        </>
                    )}
                </div>
            </>
        ),
        [
            order,
            userRoleGroup,
            driver,
            canPerformActions,
            handleSetDriverDrawerOpen,
            isMePartner,
            isDriver,
            dispatcher,
            handleSetDispatcherDrawerOpen,
            shipperCompany,
            carrierCompany,
        ],
    );

    return <Paper className={cn()} body={body} bodyClassName={cn()} />;
};
