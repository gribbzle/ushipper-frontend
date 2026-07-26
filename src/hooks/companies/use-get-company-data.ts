import { useAppSelector } from '@store';
import { useGetCompanyQuery } from '@store/api/company-api';
import { authorizedUserSelector } from '@store/global';

export const useGetCompanyData = (userCompanyPublicId?: string) => {
    const user = useAppSelector(authorizedUserSelector);
    const id = userCompanyPublicId || user?.companyPublicId;

    const { data, isLoading } = useGetCompanyQuery(id || '', {
        skip: !id,
    });

    return { data, isLoading };
};
