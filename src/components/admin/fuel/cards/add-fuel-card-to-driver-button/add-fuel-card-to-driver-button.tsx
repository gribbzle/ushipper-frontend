import React, { MouseEvent, useCallback } from 'react';

import { Button } from '@/components/common';
import { useFuelCardsActionsPermission } from '@hooks';
import { PlusIcon } from '@icons';
import { useAppDispatch } from '@store';
import { fuelActions, FuelCard } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:fuel:cards-page:add-fuel-card-to-driver-popup');

export const AddFuelCardToDriverButton = ({ fuelCard }: { fuelCard: FuelCard }) => {
    const dispatch = useAppDispatch();
    const hasFuelCardsActionsPermission = useFuelCardsActionsPermission();

    const handleOpenAddFuelCardToDriverPopup = useCallback(
        async (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            dispatch(fuelActions.setFuelCardToDriverPopupProps({ isPopupOpened: true, fuelCard }));
        },
        [dispatch, fuelCard],
    );

    return (
        <Button onClick={event => handleOpenAddFuelCardToDriverPopup(event)} size='small' disabled={!hasFuelCardsActionsPermission}>
            <PlusIcon />
            {t('add')}
        </Button>
    );
};
