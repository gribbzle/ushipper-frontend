import { UserRoleGroup } from '@/enums/user-role-group';
import { useUserRoleGroup } from '@/hooks';
import { useAppSelector } from '@store';
import { orderCarrierOrderSelector, orderShipperOrderSelector } from '@store/client';

export const useDisableProductChanging = () => {
    const userRoleGroup = useUserRoleGroup();

    const shipperOrder = useAppSelector(orderShipperOrderSelector);
    const carrierOrder = useAppSelector(orderCarrierOrderSelector);

    const shipperHasCarrierOrder = userRoleGroup === UserRoleGroup.SHIPPERS && carrierOrder;
    const carrierHasShipperOrder = userRoleGroup === UserRoleGroup.CARRIERS && shipperOrder;

    return !!(shipperHasCarrierOrder || carrierHasShipperOrder);
};
