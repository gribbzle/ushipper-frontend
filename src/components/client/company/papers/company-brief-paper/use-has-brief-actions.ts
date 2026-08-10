import { useMemo } from 'react';

import { useIsCarrierOwnerPage, useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { useMeCarrier, useMeDispatcher, useMeDriver } from '@/hooks/use-user-role-group';

export const useHasBriefActions = () => {
    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const isDriverOwnerPage = useIsDriverOwnerPage();
    const isCarrierOwnerPage = useIsCarrierOwnerPage();
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();
    const isMeCarrier = useMeCarrier();

    const hasBriefActions = useMemo(
        () => (isCarrierOwnerPage && (isMeDispatcher || isMeDriver)) || ((isDispatcherOwnerPage || isDriverOwnerPage) && isMeCarrier),
        [isCarrierOwnerPage, isMeDispatcher, isMeDriver, isDispatcherOwnerPage, isDriverOwnerPage, isMeCarrier],
    );

    return { hasBriefActions };
};
