import React from 'react';

import { GoldTruckIcon, LikeIcon } from '@icons';
import { useAppSelector } from '@store';
import { fetchedSelectedDriverIdSelector, TrackingDriver } from '@store/client';
import { classname } from '@utils';

import './driver-truck-pin.scss';

type DriverTruckPinProps = {
    driver: TrackingDriver;
    disabled?: boolean;
};

const cn = classname('driver-truck-pin');

export const DriverTruckPin = ({ driver, disabled = true }: DriverTruckPinProps) => {
    const { bearing, isFlagged } = driver;
    const selectedDriverId = useAppSelector(fetchedSelectedDriverIdSelector);

    return (
        <div
            className={cn('', { focused: selectedDriverId === driver.publicId, disabled })}
            style={{
                transform: `rotate(${bearing}deg)`,
            }}
        >
            <GoldTruckIcon className={cn('truck')} />
            {/* TODO add when the backend is finalized
            // {truckLoadPercentage ? <GoldTruckIcon className={cn('truck')} /> : <WhiteTruckIcon className={cn('truck')} />}*/}
            {isFlagged && (
                <div
                    className={cn('like')}
                    style={{
                        transform: `translate(50%, -50%) rotate(${bearing * -1}deg)`,
                    }}
                >
                    <LikeIcon />
                </div>
            )}
        </div>
    );
};
