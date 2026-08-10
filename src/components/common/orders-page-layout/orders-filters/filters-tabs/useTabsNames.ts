import { useCallback, useMemo } from 'react';

import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { useHasPartnerCompanies, useIsPartnerCompany, useMeCarrier, useMeDriver } from '@hooks';

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
