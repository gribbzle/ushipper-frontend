import { useMemo } from 'react';

import { useGetCompanyData } from '@hooks';

export const useIsAuthorizedUserCompanyPartner = () => {
    const { data: authorizedUserCompany } = useGetCompanyData();

    const isPartner = useMemo(() => authorizedUserCompany?.isPartner, [authorizedUserCompany]);

    return { isPartner };
};
