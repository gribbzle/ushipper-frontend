import { useMemo } from 'react';

import { UserRoleType } from '@/enums';
import { useAppSelector } from '@store';
import { accountsUsersSelector } from '@store/client/accounts';

export const useHasSendRequestForNoPartnerUserPermissions = () => {
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const noPartnerCarrierDriverAccount = useMemo(
        () => fetchedAccounts?.find(account => !account.company?.isPartner && account.role.type === UserRoleType.CARRIER_DRIVER),
        [fetchedAccounts],
    );

    const hasSendRequestForNoPartnerUserPermission = useMemo(
        () => noPartnerCarrierDriverAccount?.role.permissions?.carrierOrders.includes('carrier.orders.requests.view_any'),
        [noPartnerCarrierDriverAccount],
    );

    return { hasSendRequestForNoPartnerUserPermission };
};
