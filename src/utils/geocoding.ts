import { GeocodingCore } from '@mapbox/search-js-core';
import { GeocodingResponse } from '@mapbox/search-js-core/dist/geocode/GeocodingCore';
import { GeocodingFeature } from '@mapbox/search-js-core/dist/geocode/types';
import { CoordinatesWithRangeRegion } from '@store/api/loadboard-api';

export type CoordsData = {
    latitude?: number | null;
    longitude?: number | null;
};

export const createGeocoding = (types: string) => {
    return new GeocodingCore({
        accessToken: process.env.mapboxToken,
        country: 'US',
        types: types,
    });
};

export const getAddressByName = (search: string, geocoding: GeocodingCore): Promise<GeocodingResponse> => {
    return geocoding.forward(search);
};

export const getAddressName = (feature: GeocodingFeature): string => {
    switch (feature.place_type[0]) {
        case 'region': {
            const [country, region] = feature.properties.short_code?.split('-') || [];

            return `${region}, ${country}`;
        }
        case 'place': {
            const [country, region] = feature.context[1].short_code?.split('-') || [];

            return `${feature.text}, ${region}, ${country}`;
        }
        case 'locality': {
            const [country, region] = feature.context[2].short_code?.split('-') || [];

            return `${feature.text}, ${feature.context[0].text}, ${region}, ${country}`;
        }
        case 'postcode':
            const [country, region] = feature.context[2].short_code?.split('-') || [];

            return `${feature.text}, ${feature.context[0].text}${region ? `, ${region}` : ''}${country ? `, ${country}` : ''}`;
        default:
            return feature.place_name;
    }
};

export const getPlaceName = (feature: GeocodingFeature): string => {
    switch (feature.place_type[0]) {
        case 'postcode':
            return feature.text;
        default:
            return feature.place_name;
    }
};

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const getDirection = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((bearing + 360) % 360) / 45) % 8;

    return directions[index];
};

export const getDistanceAndDirection = ({ latitude, longitude }: CoordsData, searchCoords?: CoordinatesWithRangeRegion[]) => {
    if (!searchCoords || !latitude || !longitude) {
        return [];
    }

    return searchCoords
        .map(coord => {
            if (coord.region || coord.state) {
                return;
            }

            const searchLat = coord.latitude;
            const searchLon = coord.longitude;
            let placeName = coord.name;

            if (placeName.endsWith('US')) {
                placeName = placeName.replace(/, [^,]*$/, '');
            }

            const distance = haversineDistance(searchLat, searchLon, latitude, longitude);
            const direction = getDirection(searchLat, searchLon, latitude, longitude);

            return `${distance.toFixed(1)}mi ${direction} of ${placeName}`;
        })
        .filter(Boolean);
};
