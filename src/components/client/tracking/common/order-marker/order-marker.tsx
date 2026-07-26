import React from 'react';

import { TrackingPointType } from '@store/client';
import { classname } from '@utils';

import './order-marker.scss';

const cn = classname('order-marker');

interface OrderMarkerProps {
    type?: TrackingPointType | 'new' | 'counter';
    borderColor?: string;
    orderNumber?: number;
    hideLetters?: boolean;
}

export const OrderMarker = ({ type, borderColor, orderNumber, hideLetters }: OrderMarkerProps) => (
    <div style={{ borderColor: borderColor }} className={cn({ type })}>
        {!hideLetters && (
            <>
                {type === 'pickup' && <span>P</span>}
                {type === 'delivery' && <span>D</span>}
            </>
        )}
        {hideLetters && orderNumber && <span>{orderNumber}</span>}
    </div>
);
