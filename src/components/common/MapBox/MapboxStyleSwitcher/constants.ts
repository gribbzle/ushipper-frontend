import { MapboxStyle } from '@enums';

import { MapboxStyleDefinition } from './types';

export const DEFAULT_STYLE: MapboxStyleDefinition = { key: MapboxStyle.STREETS, uri: 'mapbox://styles/mapbox/streets-v11' };

export const DEFAULT_STYLES: MapboxStyleDefinition[] = [
    { key: MapboxStyle.LIGHT, uri: 'mapbox://styles/mapbox/light-v10' },
    { key: MapboxStyle.DARK, uri: 'mapbox://styles/mapbox/dark-v10' },
    DEFAULT_STYLE,
    { key: MapboxStyle.OUTDOORS, uri: 'mapbox://styles/mapbox/outdoors-v11' },
    { key: MapboxStyle.SATELLITE, uri: 'mapbox://styles/mapbox/satellite-streets-v11' },
];
