import { useRouter } from 'next/router';

import { useGetCompanyQuery } from '@store/api/company-api';

export const useCompanyPage = () => {
    const router = useRouter();
    const companyId = router.query['company-id'] as string;
    const { data: company, isError, error, isLoading } = useGetCompanyQuery(companyId);

    return { company, isError, error, isLoading };
};
