import { useMemo } from 'react';

import { useHasPartnerCompanies } from '@/hooks/authorized-user/use-has-partner-companies';
import { useMeCarrierDriver } from '@/hooks/use-user-role-type';
import { useMeDispatcher, useMeDriver } from '@/hooks/use-user-role-group';

import { useHasSendRequestAuthorizedUserPermissions } from './use-has-send-request-authorized-user-permission';
import { useHasSendRequestForNoPartnerUserPermissions } from './use-has-send-request-for-no-partner-user-permission';
import { useIsAuthorizedUserCompanyPartner } from './use-is-authorized-user-company-partner';

export const useSendRequestConditions = () => {
    const { hasPartnerCompanies, fetchedAccounts } = useHasPartnerCompanies();
    const { hasSendRequestAuthorizedUserPermission } = useHasSendRequestAuthorizedUserPermissions();
    const { hasSendRequestForNoPartnerUserPermission } = useHasSendRequestForNoPartnerUserPermissions();

    const { isPartner } = useIsAuthorizedUserCompanyPartner();

    const isMeDriver = useMeDriver();
    const isMeDispatcher = useMeDispatcher();
    const isMeCarrierDriver = useMeCarrierDriver();

    const isSingleDriverOrDispatcher = useMemo(
        () => (isMeDriver && fetchedAccounts?.length === 1) || isMeDispatcher,
        [fetchedAccounts?.length, isMeDispatcher, isMeDriver],
    );

    const isEmptySendRequest = useMemo(
        () => (isMeDriver && hasPartnerCompanies) || (isMeCarrierDriver && isPartner && hasSendRequestAuthorizedUserPermission),
        [hasPartnerCompanies, hasSendRequestAuthorizedUserPermission, isMeCarrierDriver, isMeDriver, isPartner],
    );

    const isDriverWithMultipleAccountsAndNoPartner = useMemo(
        () => isMeDriver && fetchedAccounts?.length && fetchedAccounts.length > 1 && !hasPartnerCompanies,
        [fetchedAccounts?.length, hasPartnerCompanies, isMeDriver],
    );

    const lacksSendRequestForCarrierDriverPermission = useMemo(
        () => isMeCarrierDriver && isPartner && !hasSendRequestAuthorizedUserPermission,
        [hasSendRequestAuthorizedUserPermission, isMeCarrierDriver, isPartner],
    );

    return {
        isSingleDriverOrDispatcher,
        isEmptySendRequest,
        isDriverWithMultipleAccountsAndNoPartner,
        lacksSendRequestForCarrierDriverPermission,
        hasSendRequestForNoPartnerUserPermission,
        isMeDriver,
    };
};
