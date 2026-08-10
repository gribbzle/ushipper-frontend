import { useMeCarrier, useMeDispatcher } from '@/hooks/use-user-role-group';

export const useJobOfferActionsInfo = () => {
    const isCarrier = useMeCarrier();
    const isDispatcher = useMeDispatcher();

    return { isCarrier, isDispatcher };
};
