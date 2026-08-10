import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { classname } from '@utils/classname';

import './shipper-tracking-order-tag.scss';
import CheckFullCircleIcon from '@/assets/icons/check-full-circle.svg';
import ExclamationFullCircleIcon from '@/assets/icons/exclamation-full-circle.svg';
import PlusFullCircleIcon from '@/assets/icons/plus-full-circle.svg';

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
