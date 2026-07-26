import { useMeCarrier, useMeDispatcher } from '@hooks';

export const useJobOfferActionsInfo = () => {
    const isCarrier = useMeCarrier();
    const isDispatcher = useMeDispatcher();

    return { isCarrier, isDispatcher };
};
