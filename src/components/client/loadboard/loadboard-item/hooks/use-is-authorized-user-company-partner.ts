import { useMemo } from 'react';

import { useGetCompanyData } from '@/hooks/companies/use-get-company-data';

export const useIsAuthorizedUserCompanyPartner = () => {
    const { data: authorizedUserCompany } = useGetCompanyData();

    const isPartner = useMemo(() => authorizedUserCompany?.isPartner, [authorizedUserCompany]);

    return { isPartner };
};
