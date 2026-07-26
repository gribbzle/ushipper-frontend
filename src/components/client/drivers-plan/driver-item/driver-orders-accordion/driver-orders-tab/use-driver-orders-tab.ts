import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { selectedSuggestedOrderIdSelector, trackingActions } from '@store/client';

export const useDriverOrdersTab = () => {
    const selectedOrderId = useAppSelector(selectedSuggestedOrderIdSelector);

    const dispatch = useAppDispatch();

    const handleOrderClick = useCallback(
        (id: string) => dispatch(trackingActions.setSelectedSuggestedOrderId(selectedOrderId === id ? null : id)),
        [dispatch, selectedOrderId],
    );

    return { handleOrderClick, selectedOrderId };
};
