import React, { useEffect, useMemo, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import { Layer, Marker, Source } from 'react-map-gl/mapbox';

import { RouteMarkerType } from '@/enums/route-marker-type-enum';
import { fetchRouteGeoJSON } from '@api';
import { useAppSelector } from '@store';
import { loadboardListSelector } from '@store/client/loadboard/selectors';

import { LoadboardRouteMarker } from '../loadboard-marker';

export const LoadboardMapRoute = () => {
    const [geoJSON, setGeoJSON] = useState<FeatureCollection | null>(null);

    const { filters } = useAppSelector(loadboardListSelector);

    const { pathStartLocation, pathEndLocation, pathWaypoints } = filters;

    useEffect(() => {
        const getGeoJSON = async (coordinates: [number, number][]) => {
            try {
                const result = await fetchRouteGeoJSON(coordinates);
                const featureCollection: FeatureCollection = {
                    type: 'FeatureCollection',
                    features: [result],
                };

                setGeoJSON(featureCollection);
            } catch {
                return null;
            }
        };

        if (pathStartLocation && pathEndLocation) {
            const coordinates: [number, number][] = [[pathStartLocation.longitude, pathStartLocation.latitude]];

            if (pathWaypoints) {
                pathWaypoints.forEach(waypoint => {
                    coordinates.push([waypoint.longitude, waypoint.latitude]);
                });
            }

            coordinates.push([pathEndLocation.longitude, pathEndLocation.latitude]);

            getGeoJSON(coordinates);
        }
    }, [pathStartLocation, pathEndLocation, pathWaypoints]);

    const routeMarkers = useMemo(() => {
        if (pathStartLocation && pathEndLocation) {
            return (
                <>
                    <Marker style={{ zIndex: 1 }} latitude={pathStartLocation.latitude} longitude={pathStartLocation.longitude}>
                        <LoadboardRouteMarker type={RouteMarkerType.ORIGIN} />
                    </Marker>
                    {pathWaypoints &&
                        pathWaypoints.map(waypoint => {
                            return (
                                <Marker key={waypoint.name} style={{ zIndex: 1 }} latitude={waypoint.latitude} longitude={waypoint.longitude}>
                                    <LoadboardRouteMarker type={RouteMarkerType.WAYPOINT} />
                                </Marker>
                            );
                        })}
                    <Marker style={{ zIndex: 1 }} latitude={pathEndLocation.latitude} longitude={pathEndLocation.longitude}>
                        <LoadboardRouteMarker type={RouteMarkerType.DESTINATION} />
                    </Marker>
                </>
            );
        }

        return null;
    }, [pathStartLocation, pathEndLocation, pathWaypoints]);

    return geoJSON && pathStartLocation && pathEndLocation ? (
        <>
            {routeMarkers}
            <Source type='geojson' data={geoJSON}>
                <Layer type='line' paint={{ 'line-width': 4 }} />
            </Source>
        </>
    ) : null;
};
