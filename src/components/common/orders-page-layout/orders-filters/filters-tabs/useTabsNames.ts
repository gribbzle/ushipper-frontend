import { useCallback, useMemo } from 'react';

import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { useHasPartnerCompanies } from '@/hooks/authorized-user/use-has-partner-companies';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useMeCarrier, useMeDriver } from '@/hooks/use-user-role-group';

import { ORDERS_FILTERS_TABS_MAP } from './constants';

export const useTabsNames = () => {
    const isMeCarrier = useMeCarrier();
    const isMeDriver = useMeDriver();
    const isPartner = useIsPartnerCompany();
    const { hasPartnerCompanies } = useHasPartnerCompanies();

    const getTabs = useCallback(() => {
        if (isMeCarrier || isMeDriver) {
            return hasPartnerCompanies || isPartner ? ORDERS_FILTERS_TABS_MAP.get('partnerCarrier') : ORDERS_FILTERS_TABS_MAP.get('carrier');
        }

        return ORDERS_FILTERS_TABS_MAP.get('shipper');
    }, [isMeCarrier, isMeDriver, isPartner, hasPartnerCompanies]);

    return useMemo((): OrderStatisticsStatus[] => getTabs() ?? [], [getTabs]);
};
