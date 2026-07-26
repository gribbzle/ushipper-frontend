import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { fuelActions, FuelCard } from '@store/admin';

export const useOpenEditFuelCardPopup = () => {
    const dispatch = useAppDispatch();

    const openClickHandler = useCallback(
        async (fuelCard: FuelCard) => dispatch(fuelActions.setEditFuelCardPopupProps({ isPopupOpened: true, fuelCard })),
        [dispatch],
    );

    return openClickHandler;
};
