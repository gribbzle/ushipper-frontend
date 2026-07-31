import { ReactNode } from 'react';
import React from 'react';

import { classname } from '@utils/classname';

import './map-marker.scss';

interface MapMarkerProps {
    children: ReactNode;
}

const cn = classname('custom-marker');

export const MapMarker = ({ children }: MapMarkerProps) => {
    return (
        <div className={cn()}>
            <div className={cn('rectangle')}>{children}</div>
            <div className={cn('triangle')}></div>
        </div>
    );
};
