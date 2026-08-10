import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { CheckFullCircleIcon, ExclamationFullCircleIcon, PlusFullCircleIcon } from '@icons';
import { classname } from '@utils/classname';

import './shipper-tracking-order-tag.scss';

type ShipperOrderTagProps = {
    children?: React.ReactNode;
    view: TrackingOrderStatus;
    showIcon?: boolean;
};

const viewToIconMap: Record<TrackingOrderStatus, React.ReactNode> = {
    [TrackingOrderStatus.NOT_DISPATCHED]: <ExclamationFullCircleIcon />,
    [TrackingOrderStatus.DISPATCHED]: <PlusFullCircleIcon />,
    [TrackingOrderStatus.PICKED_UP]: <CheckFullCircleIcon />,
};

const cn = classname('shipper-tracking-order-tag');

export const ShipperOrderTag = ({ view, children, showIcon = false }: ShipperOrderTagProps) => {
    return (
        <div className={cn('', { view: toKebabCase(view), 'has-icon': showIcon })}>
            {showIcon && viewToIconMap[view]}
            {children}
        </div>
    );
};
