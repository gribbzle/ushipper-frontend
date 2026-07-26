import { useMemo } from 'react';

import { CompanyType } from '@/enums';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';

export const useIsDispatcherOwnerPage = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return useMemo(() => company?.type === CompanyType.DISPATCHER, [company]);
};

export const useIsShipperOwnerPage = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return useMemo(() => company?.type === CompanyType.SHIPPER, [company]);
};

export const useIsCarrierOwnerPage = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return useMemo(() => company?.type === CompanyType.CARRIER, [company]);
};

export const useIsDriverOwnerPage = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return useMemo(() => company?.type === CompanyType.DRIVER, [company]);
};
