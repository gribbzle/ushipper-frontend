import { useMemo } from 'react';

import { useIsCarrierOwnerPage, useIsDispatcherOwnerPage, useIsDriverOwnerPage, useMeCarrier, useMeDispatcher, useMeDriver } from '@hooks';

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
