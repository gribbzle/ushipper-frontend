import React from 'react';

import { useAppSelector } from '@store';
import { openShipperTrackingFiltersSelector } from '@store/client';
import { classname } from '@utils';

import { ShipperTrackingFilters } from './shipper-tracking-filters';
import { ShipperTrackingSearchButton } from './shipper-tracking-search-button';

import './shipper-tracking-filters-block.scss';

const cn = classname('shipper-tracking-filters-block');

export const ShipperTrackingFiltersBlock = () => {
    const showFilters = useAppSelector(openShipperTrackingFiltersSelector);

    return (
        <div className={cn()}>
            <ShipperTrackingSearchButton />
            {showFilters && <ShipperTrackingFilters />}
        </div>
    );
};
