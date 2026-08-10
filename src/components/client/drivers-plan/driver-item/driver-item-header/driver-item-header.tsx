import React from 'react';

import { Divider } from '@/components/common/divider/divider';
import { User } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isUshipper } from '@utils/project-config';

import { DriverDetailsWrapper } from './driver-details-wrapper';
import { UserDetails } from './user-details';

import './driver-item-header.scss';
import CarIcon2 from '@/assets/icons/car-icon2.svg';
import Flag2Icon from '@/assets/icons/flag2.svg';
import GeoLocationIcon from '@/assets/icons/geolocation-icon.svg';
import Truck from '@/assets/icons/truck.svg';

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
