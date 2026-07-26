import { Feature, Point } from 'geojson';

import bbox from '@turf/bbox';
import { Coordinate } from '@types';

export * from './map-order-status-to-tracking-order-status';
export * from './get-order-tracking-points';
export * from './tracking-driver-helpers';
export * from './optimal-route-finder';
export * from './shipper-tracking-order-helpers';

export const pointsToBounds = (points: Coordinate[]): [number, number, number, number] => {
    const features = points.map(point => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
        },
    })) as Feature<Point>[];

    const [minLng, minLat, maxLng, maxLat] = bbox({
        type: 'FeatureCollection',
        features,
    });

    return [minLng, minLat, maxLng, maxLat];
};
