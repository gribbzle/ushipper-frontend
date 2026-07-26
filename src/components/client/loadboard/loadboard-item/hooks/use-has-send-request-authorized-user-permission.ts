import { useMemo } from 'react';

import { useAppSelector } from '@store';
import { permissionsSelector } from '@store/global';

export const useHasSendRequestAuthorizedUserPermissions = () => {
    const permissibility = useAppSelector(permissionsSelector);
    const hasSendRequestAuthorizedUserPermission = useMemo(() => permissibility?.carrierOrders?.includes('carrier.orders.requests.view_any'), [permissibility]);

    return { hasSendRequestAuthorizedUserPermission };
};
