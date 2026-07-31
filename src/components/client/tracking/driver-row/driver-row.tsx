import { MouseEvent, useCallback, useMemo, useState } from 'react';
import React from 'react';

import { DriverOrders } from '@/components/client/tracking/driver-orders/driver-orders';
import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { useDriverTrackingMap, useTracking, useUserTracking } from '@hooks';
import { ArrowDownIcon } from '@icons';
import { classname } from '@utils/classname';
import { checkIsGPSStatusRecentlyUpdated } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { stringAvatar } from '@utils/string-avatar';

import './driver-row.scss';

const cn = classname('driver-row');
const t = translateByNamespace('client:tracking-page');

export const DriverRow = (): JSX.Element => {
    const { user: driver, orders } = useUserTracking();
    const { flyToDriver } = useTracking();

    const {
        setConfig,
        config: { driver: selectedDriver },
    } = useDriverTrackingMap();

    const latestLocationDateInfo = useMemo(
        (): string => (driver.latestLocation?.createdAt ? new Date(driver.latestLocation?.createdAt).diffForHumans() : ''),
        [driver],
    );

    const isGPSStatusRecentlyUpdated = useMemo(
        (): boolean => (driver.latestLocation?.createdAt ? Boolean(checkIsGPSStatusRecentlyUpdated(driver.latestLocation?.createdAt)) : false),
        [driver],
    );

    const [isShownOrders, setIsShownOrders] = useState(false);

    const handleShowOrders = (e: MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
        setIsShownOrders(state => !state);
    };

    const orderCount = orders.length;

    const handleClick = useCallback(
        (e: MouseEvent<HTMLDivElement>): void => {
            e.stopPropagation();

            setConfig({ driver, displayDriverLocation: true });
            flyToDriver(driver);
        },
        [driver, flyToDriver, setConfig],
    );

    return (
        <div id={driver.publicId} className={cn('', { selected: selectedDriver?.publicId === driver.publicId })} onClick={handleClick}>
            <div className={cn('header')}>
                <Badge variant='dot' size='mini' withBorder={true} color={isGPSStatusRecentlyUpdated ? 'success' : 'danger'}>
                    <Avatar src={driver.avatar?.url}>{driver.avatar?.url ? '' : stringAvatar(driver.name)}</Avatar>
                </Badge>
                <div className={cn('driver-info-container')}>
                    <div className={cn('driver-info')}>
                        <span className={cn('driver-name')}>
                            {driver.name} {driver.nickname && `(${driver.nickname})`}
                        </span>
                        {latestLocationDateInfo ? (
                            <span className={cn('latest-location-date-info', { danger: !isGPSStatusRecentlyUpdated })}>{latestLocationDateInfo}</span>
                        ) : (
                            <div className={cn('switched-off-label')}>{t('switched-off')}</div>
                        )}
                    </div>
                    {!orderCount && <span className={cn('no-orders-assigned-to')}>{t('no-orders-assigned-to')}</span>}
                    {!!orderCount && (
                        <div className={cn('dropdown-wrapper')}>
                            <div className={cn('orders-dropdown', { opened: isShownOrders })} onClick={handleShowOrders}>
                                <span>
                                    {t('orders-to-deliver', {
                                        ordersNumber: orderCount,
                                        specification: t('order', { count: orderCount }),
                                    })}
                                </span>
                                <ArrowDownIcon className={cn('arrow', { opened: isShownOrders })} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isShownOrders && <DriverOrders />}
        </div>
    );
};
