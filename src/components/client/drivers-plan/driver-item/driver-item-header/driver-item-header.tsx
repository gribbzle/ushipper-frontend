import React from 'react';

import { Divider } from '@components';
import { CarIcon2, Flag2Icon, GeoLocationIcon, Truck } from '@icons';
import { User } from '@store/common';
import { classname, isUshipper, translateByNamespace } from '@utils';

import { DriverDetailsWrapper } from './driver-details-wrapper';
import { UserDetails } from './user-details';

import './driver-item-header.scss';

const cn = classname('driver-item-header');
const t = translateByNamespace('client:drivers-plan:driver-item');
const tVehicles = translateByNamespace('client:loadboard:load-details');

export const DriverItemHeader = ({ driver }: { driver: User }) => {
    const { trailerCapacity, ordersCount } = driver;

    return (
        <div className={cn()}>
            <UserDetails driver={driver} />
            <div className={cn('right')}>
                <DriverDetailsWrapper title={t('current-location')} Icon={GeoLocationIcon} value={t('no-data')} />

                {isUshipper && (
                    <>
                        <Divider orientation='vertical' lineStyle='dashed' />
                        <DriverDetailsWrapper title={t('trailer-capacity')} Icon={CarIcon2} value={tVehicles('vehicle', { count: trailerCapacity })} />
                    </>
                )}
                <Divider orientation='vertical' lineStyle='dashed' />
                <DriverDetailsWrapper title={t('average-speed')} Icon={Flag2Icon} value={t('no-data')} />
                <Divider orientation='vertical' lineStyle='dashed' />
                <DriverDetailsWrapper title={t('loads-to-deliver')} Icon={Truck} value={ordersCount} />
            </div>
        </div>
    );
};
