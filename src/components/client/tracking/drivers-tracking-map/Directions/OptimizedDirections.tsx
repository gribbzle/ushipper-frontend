import React from 'react';
import { Marker } from 'react-map-gl/mapbox';

import { OrderMarker } from '@/components/client/tracking/common/order-marker/order-marker';
import { useDriverTrackingMap } from '@/hooks/tracking/useDriverTrackingMap';

import Source from './Direction/Source';

const DEFAULT_COLOR = '#409eff';

export const OptimizedDirections = (): JSX.Element | null => {
    const {
        config: { optimizedRoute },
    } = useDriverTrackingMap();

    if (!optimizedRoute) {
        return null;
    }

    return (
        <>
            {optimizedRoute.properties.waypoints.map(
                (waypoint, index): JSX.Element => (
                    <Marker longitude={waypoint.location[0]} latitude={waypoint.location[1]} key={index}>
                        <OrderMarker type='counter' hideLetters={true} orderNumber={waypoint.waypointIndex + 1} />
                    </Marker>
                ),
            )}
            <Source color={DEFAULT_COLOR} data={optimizedRoute} />
        </>
    );
};
