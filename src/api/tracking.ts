import type { Feature } from 'geojson';

import { UserTracking } from '@store/client';
import { axios } from '@utils';

export const fetchTrackingInformation = async () => {
    const result = await axios.get('/api/users/tracking');

    return result.data.data as UserTracking;
};

export const fetchFilteredTrackingInformation = async ({ haveOrders = null, nameOrId = null }: { haveOrders: boolean | null; nameOrId: string | null }) => {
    let url = '/api/users/tracking';

    if (haveOrders !== null || nameOrId) {
        url += `?${haveOrders !== null ? 'has_orders=' + Number(haveOrders) : ''}${haveOrders !== null && nameOrId ? '&' : ''}${
            nameOrId ? 'query=' + nameOrId : ''
        }`;
    }
    const result = await axios.get(url);

    return result.data.data as UserTracking;
};

interface GeoJSONResponseRoute {
    distance: number;
    duration: number;
    geometry: {
        coordinates: number[][];
        type: string;
    };
    legs: {
        admins: {
            iso31661: string;
            iso31661Alpha3: string;
        }[];
        distance: number;
        duration: number;
        steps: [];
        summary: string;
        weight: number;
    }[];
    weight: number;
    weightName: string;
}

interface FetchRouteGeoJSONResponse {
    routes: GeoJSONResponseRoute[];
}

export const fetchRouteGeoJSON = async (coordinates: [number, number][]) => {
    try {
        let coordinatesString = '';

        coordinates.forEach(item => {
            coordinatesString += `${item[0]},${item[1]};`;
        });
        coordinatesString = coordinatesString.slice(0, -1);
        const result = await axios.get<FetchRouteGeoJSONResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}`, {
            params: {
                geometries: 'geojson',
                overview: 'full',
                access_token: process.env.mapboxToken,
            },
        });
        const route = result.data.routes[0];

        const routeGeoJSON = {
            type: 'Feature',
            ...route,
            properties: {},
        } as Feature;

        return routeGeoJSON;
    } catch (e) {
        throw e;
    }
};

type DistanceMatrixResponse = {
    durations: number[][];
    distances: number[][];
    destinations: Array<Record<string, unknown>>;
    sources: Array<Record<string, unknown>>;
};

export const getDistanceMatrix = async (coordinates: [number, number][], sources?: number[], destinations?: number[]) => {
    let coordinatesString = '';

    coordinates.forEach(item => {
        coordinatesString += `${item[0]},${item[1]};`;
    });
    coordinatesString = coordinatesString.slice(0, -1);

    const result = await axios.get<DistanceMatrixResponse>(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinatesString}`, {
        params: {
            access_token: process.env.mapboxToken,
            annotations: 'distance',
            sources: sources?.join(';'),
            destinations: destinations?.join(';'),
        },
    });

    return result.data;
};
