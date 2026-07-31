import React, { useCallback } from 'react';

import { GenericButton } from '@/components/common/generic-button/generic-button';
import { SearchIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { openShipperTrackingFiltersSelector, trackingActions } from '@store/client';

export const ShipperTrackingSearchButton = () => {
    const dispatch = useAppDispatch();
    const isOpenFilters = useAppSelector(openShipperTrackingFiltersSelector);

    const handleToggle = useCallback(() => {
        dispatch(trackingActions.setOpenShipperTrackingFilters(!isOpenFilters));
    }, [dispatch, isOpenFilters]);

    return (
        <GenericButton
            view='primary'
            figure='circle'
            size='large'
            onClick={e => {
                e?.stopPropagation();

                handleToggle();
            }}
        >
            <SearchIcon />
        </GenericButton>
    );
};
