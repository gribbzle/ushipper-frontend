import React, { useCallback, useMemo } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { Driver, TrackingDriver, User } from '@store/client';
import { classname } from '@utils/classname';
import { checkIsGPSStatusRecentlyUpdated } from '@utils/dates';
import { stringAvatar } from '@utils/string-avatar';

import './driver-order-pin.scss';
import DriverIcon from '@/assets/icons/driver-icon.svg';

const cn = classname('driver-order-pin');

interface DriverOrderPinProps {
    driver: Driver | User | TrackingDriver;
    isDisabled?: boolean;
    className?: string;
    onPress?: () => void;
    isActive?: boolean;
}

export const DriverOrderPin = ({ driver, isDisabled, className, onPress, isActive = false }: DriverOrderPinProps) => {
    const isGPSStatusRecentlyUpdated = useMemo(
        (): boolean => (driver.latestLocation ? Boolean(checkIsGPSStatusRecentlyUpdated(driver.latestLocation.createdAt)) : false),
        [driver],
    );

    const handleClickDriverPin = useCallback(
        (e: React.MouseEvent): void => {
            e.stopPropagation();

            if (!isDisabled) {
                onPress?.();
            }
        },
        [isDisabled, onPress],
    );

    return (
        <div className={cn('', [className])}>
            <DriverIcon className={cn('marker-icon', { active: isActive })} />
            <Badge
                className={cn('icon-wrapper')}
                variant='dot'
                size='mini'
                color={isGPSStatusRecentlyUpdated ? 'success' : 'danger'}
                withBorder={true}
                onClick={handleClickDriverPin}
            >
                <Avatar src={driver.avatar?.url}>{driver.avatar?.url ? '' : stringAvatar(driver.name)}</Avatar>
            </Badge>
        </div>
    );
};
