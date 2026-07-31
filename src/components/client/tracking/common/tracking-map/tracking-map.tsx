import React, { ReactNode } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import { Map } from 'react-map-gl/mapbox';

import { classname } from '@utils/classname';

import 'mapbox-gl/dist/mapbox-gl.css';
import './tracking-map.scss';

interface TrackingMapProps {
    mapRef?: React.RefObject<MapRef>;
    mapStyle?: string;
    children?: ReactNode;
}

const cn = classname('tracking-map');

export const TrackingMap = ({ mapRef, mapStyle, children }: TrackingMapProps) => {
    return (
        <div className={cn()}>
            <Map ref={mapRef} mapboxAccessToken={process.env.mapboxToken} onRender={event => event.target.resize()} mapStyle={mapStyle}>
                {children}
            </Map>
        </div>
    );
};

export default TrackingMap;
