import React, { MouseEvent, useCallback } from 'react';

import { DriverOrder } from '@/components/client';
import { Button } from '@/components/common';
import { UserRoleGroup } from '@enums';
import { useDriverTrackingMap, useTracking, useUserRoleGroup, useUserTracking } from '@hooks';
import { LineBrokenIcon } from '@icons';
import { OrderTrackingProvider } from '@providers';
import { classname, formatMetersToMiles, translateByNamespace } from '@utils';

import './driver-orders.scss';

const cn = classname('orders-container');

const translateTrackingPage = translateByNamespace('client:tracking-page');

export const DriverOrders = (): JSX.Element => {
    const { user: driver, orders, pathInfo } = useUserTracking();
    const userRoleGroup = useUserRoleGroup();
    const { fitBoundsToOrdersRoute, getOptimizedTrips } = useTracking();
    const { setConfig } = useDriverTrackingMap();

    const handleViewWholeRouteBtnClick = useCallback(
        async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
            e.stopPropagation();

            const optimizedRoute = await getOptimizedTrips(orders);

            fitBoundsToOrdersRoute(driver, orders);

            setConfig({ driver, optimizedRoute, displayDriverLocation: true, displayOptimizedRoute: true });
        },
        [driver, fitBoundsToOrdersRoute, getOptimizedTrips, orders, setConfig],
    );

    const handleViewAllRoutesBtnClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();

            fitBoundsToOrdersRoute(driver, orders);
            setConfig({ driver, orders, displayOrdersRoute: true, displayDriverLocation: true });
        },
        [fitBoundsToOrdersRoute, driver, orders, setConfig],
    );

    return (
        <div className={cn('')}>
            {orders.map(orderTracking => (
                <OrderTrackingProvider value={orderTracking} key={orderTracking.publicId}>
                    <DriverOrder />
                </OrderTrackingProvider>
            ))}
            {orders.length > 1 && userRoleGroup !== UserRoleGroup.SHIPPERS && (
                <div className={cn('buttons')}>
                    <Button view='primary' plain={true} className={cn('view-whole-route-button')} size='mini' onClick={handleViewWholeRouteBtnClick}>
                        <LineBrokenIcon /> {translateTrackingPage('view-whole-route', { distance: formatMetersToMiles(pathInfo.distance) })}
                    </Button>
                    <Button view='default' plain={true} className={cn('view-whole-route-button')} size='mini' onClick={handleViewAllRoutesBtnClick}>
                        {translateTrackingPage('show-all-orders')}
                    </Button>
                </div>
            )}
        </div>
    );
};
