import * as React from 'react';
import { Ref, useCallback, useState } from 'react';
import { Map, MapProps, MapRef } from 'react-map-gl/mapbox';

import { DEFAULT_STYLE, MapboxStyleSwitcher } from './MapboxStyleSwitcher';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

type MapBoxProps = Omit<MapProps, 'onBoxZoomStart' | 'onBoxZoomEnd' | 'onBoxZoomCancel'> & {
    enableStyleSwitcher?: boolean;
    innerRef?: Ref<MapRef>;
};

export const MapBox = ({ innerRef, children, enableStyleSwitcher = false, ...rest }: MapBoxProps): JSX.Element => {
    const [mapStyle, setMapStyle] = useState<string>(DEFAULT_STYLE.uri);

    const handleChange = useCallback((value: string) => {
        setMapStyle(value);
    }, []);

    return (
        <Map
            ref={innerRef}
            style={{
                height: '100%',
                width: '100%',
                fontFamily: 'unset',
            }}
            initialViewState={{
                latitude: 34.85215697952346,
                longitude: -98.23762822254943,
                zoom: 4,
            }}
            mapboxAccessToken={process.env.mapboxToken}
            mapStyle={mapStyle}
            {...rest}
        >
            {children}
            {enableStyleSwitcher && <MapboxStyleSwitcher onChange={handleChange} />}
        </Map>
    );
};
