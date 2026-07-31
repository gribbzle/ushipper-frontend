import React, { useMemo } from 'react';

import { PulseMarker } from '@/components/common/pulse-marker/pulse-marker';
import { OrderStatus } from '@/enums';
import { classname } from '@utils/classname';

import './order-pin.scss';

const orderStatusToViewMap: Record<OrderStatus, 'dispatched' | 'warning' | 'disabled' | 'delivered'> = {
    [OrderStatus.NEW]: 'disabled',
    [OrderStatus.ON_HOLD]: 'disabled',
    [OrderStatus.POSTED]: 'disabled',
    [OrderStatus.PENDING]: 'disabled',
    [OrderStatus.DECLINED]: 'disabled',
    [OrderStatus.CANCELED]: 'disabled',
    [OrderStatus.ACCEPTED]: 'dispatched',
    [OrderStatus.PICKED_UP]: 'warning',
    [OrderStatus.DELIVERED]: 'delivered',
};

type OrderPinProps = {
    status: OrderStatus;
    isHover?: boolean;
    details?: string;
};

const cn = classname('order-pin');

export const OrderPin = ({ status, details, isHover = false }: OrderPinProps) => {
    const view = orderStatusToViewMap[status] || 'disabled';

    const pulseEnabled = useMemo(() => {
        if ([OrderStatus.ACCEPTED, OrderStatus.PICKED_UP, OrderStatus.DELIVERED, OrderStatus.CANCELED].includes(status)) {
            return false;
        }

        return true;
    }, [status]);

    return (
        <div className={cn()}>
            {details && (
                <>
                    <div className={cn('line', { view })}></div>
                    <div className={cn('details', { view })}>{details}</div>
                </>
            )}
            <PulseMarker pulseSize='large' view={view} pulseEnabled={pulseEnabled} isHover={isHover} />
        </div>
    );
};
