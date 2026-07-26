import React from 'react';

import { classname } from '@utils';

import './pulse-marker.scss';

type PulseMarkerProps = {
    pulseEnabled?: boolean;
    pulseSize?: 'large';
    view?: 'primary' | 'warning' | 'disabled' | 'dispatched' | 'delivered';
    isHover?: boolean;
};

const cn = classname('pulse-marker');

export const PulseMarker = ({ pulseEnabled = true, pulseSize, view = 'primary', isHover = false }: PulseMarkerProps) => {
    return <div className={cn('', { view, hover: isHover })}>{pulseEnabled && <div className={cn('pulse', { view, size: pulseSize })}></div>}</div>;
};
