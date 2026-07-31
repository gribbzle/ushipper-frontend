import React from 'react';

import { InspectionSubtype, RouteMarkerType } from '@/enums';
import { Load } from '@store/client';
import { classname } from '@utils/classname';

import './loadboard-marker.scss';

const cn = classname('loadboard-marker');

type LoadboardMarkerProps = {
    type: InspectionSubtype;
    order: Load;
    chooseOrders: (order: Load, type: InspectionSubtype) => void;
};

export const LoadboardMarker = ({ type, order, chooseOrders }: LoadboardMarkerProps) => (
    <div className={cn({ type })} onClick={() => chooseOrders(order, type)}>
        {type === InspectionSubtype.PICKUP && <span>P</span>}
        {type === InspectionSubtype.DELIVERY && <span>D</span>}
    </div>
);

const loadboardRouteMarkerCn = classname('loadboard-route-marker');

type LoadboardRouteMarkerProps = {
    type: RouteMarkerType;
};

export const LoadboardRouteMarker = ({ type }: LoadboardRouteMarkerProps) => (
    <div className={loadboardRouteMarkerCn({ type })}>
        {type === RouteMarkerType.DESTINATION && <span>D</span>}
        {type === RouteMarkerType.ORIGIN && <span>O</span>}
        {type === RouteMarkerType.WAYPOINT && <span>W</span>}
    </div>
);
