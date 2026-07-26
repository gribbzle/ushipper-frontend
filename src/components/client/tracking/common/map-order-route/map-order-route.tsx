import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';
import { Layer, MapRef, Source } from 'react-map-gl/mapbox';

import { fetchRouteGeoJSON } from '@api';
import { useAppSelector } from '@store';
import { selectedIsTestRoutePathLogic, TrackingMapPoint } from '@store/client';

import 'mapbox-gl/dist/mapbox-gl.css';

const defaultColor = '#409eff';

type MapOrderRouteProps = {
    startPoint: TrackingMapPoint;
    endPoint: TrackingMapPoint;
    mapRef: React.RefObject<MapRef>;
    bounds: LngLatBounds;
};

export const MapOrderRoute = ({ startPoint, endPoint, mapRef, bounds }: MapOrderRouteProps) => {
    const [geoJSON, setGeoJSON] = useState<FeatureCollection | null>(null);
    const isTestRoutePathLogic = useAppSelector(selectedIsTestRoutePathLogic);

    const orderColor = defaultColor;

    const sourceId = useRef(`${startPoint.pointId}-${endPoint.pointId}`).current;

    useEffect(() => {
        const getGeoJSON = async (coordinates: [number, number][]) => {
            try {
                const result = await fetchRouteGeoJSON(coordinates);

                const featureCollection: FeatureCollection = {
                    type: 'FeatureCollection',
                    features: [result],
                };

                setGeoJSON(featureCollection);
            } catch (e) {
                return null;
            }
        };

        if (mapRef.current) {
            bounds.extend([startPoint.lon, startPoint.lat]).extend([endPoint.lon, endPoint.lat]);

            getGeoJSON([
                [startPoint.lon, startPoint.lat],
                [endPoint.lon, endPoint.lat],
            ]);

            mapRef.current.fitBounds(bounds, { padding: 70 });
        }
    }, [startPoint, endPoint, bounds, mapRef]);

    const lineColor = useMemo(() => (isTestRoutePathLogic ? '' : orderColor), [orderColor, isTestRoutePathLogic]);

    if (!geoJSON) {
        return <></>;
    }

    return (
        <Source id={sourceId} type='geojson' data={geoJSON}>
            <Layer
                type='line'
                layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                }}
                paint={{
                    'line-color': lineColor,
                    'line-opacity': 0.8,
                    'line-width': 4,
                }}
            />
        </Source>
    );
};
