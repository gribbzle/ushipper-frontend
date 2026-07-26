import { useMemo } from 'react';

import { useMeCarrier } from '@/hooks';
import { useAppSelector } from '@store';
import { orderShipperOrderSelector } from '@store/client';

export const useDisableCarrierChanging = () => {
    const isCarrier = useMeCarrier();

    const shipperOrder = useAppSelector(orderShipperOrderSelector);

    return useMemo(() => {
        return !!(isCarrier && shipperOrder);
    }, [isCarrier, shipperOrder]);
};
