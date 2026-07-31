import { useMemo } from 'react';

import { useMeCarrier } from '@/hooks/use-user-role-group';
import { useAppSelector } from '@store';
import { orderShipperOrderSelector } from '@store/client';

export const useDisableCarrierChanging = () => {
    const isCarrier = useMeCarrier();

    const shipperOrder = useAppSelector(orderShipperOrderSelector);

    return useMemo(() => {
        return !!(isCarrier && shipperOrder);
    }, [isCarrier, shipperOrder]);
};
