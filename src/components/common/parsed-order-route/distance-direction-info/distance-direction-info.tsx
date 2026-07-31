import React from 'react';

import { CoordsData, getDistanceAndDirection } from '@/utils/geocoding';
import { CoordinatesWithRange } from '@store/api/loadboard-api';
import { classname } from '@utils/classname';

import './distance-direction-info.scss';

type Props = {
    searchCoords?: CoordinatesWithRange[];
    data: CoordsData;
    className?: string;
};

const cn = classname('distance-direction-info');

export const DistanceDirectionInfo = ({ searchCoords, data, className }: Props) => {
    const info = getDistanceAndDirection(data, searchCoords)[0];

    if (!info) return null;

    return <span className={cn('', [className])}>{info}</span>;
};
