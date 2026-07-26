import React from 'react';
import { GeoJSONSourceSpecification } from 'mapbox-gl';
import { Layer as MapBoxLayer, Source as MapBoxSource } from 'react-map-gl/mapbox';

type SourceProps = Omit<GeoJSONSourceSpecification, 'children' | 'type'> & {
    color?: string;
};

const Source = ({ color, ...rest }: SourceProps): JSX.Element => (
    <MapBoxSource type='geojson' {...rest}>
        <MapBoxLayer
            type='line'
            layout={{
                'line-join': 'round',
                'line-cap': 'round',
            }}
            paint={{
                'line-color': color,
                'line-width': 4,
            }}
        />
    </MapBoxSource>
);

export default Source;
