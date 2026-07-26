import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions, fuelActions, FuelCard } from '@store/admin';
import { useGetFuelCardsQuery } from '@store/api/fuel-cards-api';

import { FuelCardsBlockProps } from './fuel-cards-block';

export const useFuelCardsBlock = ({ accountId, accountName }: FuelCardsBlockProps) => {
    const dispatch = useAppDispatch();

    const { data: cardsPaginateData, isSuccess } = useGetFuelCardsQuery({ accountId }, { skip: !accountId });

    const onAddFuelCardClickHandler = useCallback(
        () => dispatch(accountingActions.setLinkFuelCardPopupProps({ isPopupOpened: true, accountId: accountId, driverName: accountName })),
        [accountId, accountName, dispatch],
    );

    const onUnassignDriverClickHandler = useCallback(
        async (fuelCard: FuelCard) => dispatch(fuelActions.setUnassignDriverFromFuelCardPopupProps({ isPopupOpened: true, fuelCard })),
        [dispatch],
    );

    return { onUnassignDriverClickHandler, onAddFuelCardClickHandler, fuelCards: cardsPaginateData?.data ?? [], isSuccess };
};
