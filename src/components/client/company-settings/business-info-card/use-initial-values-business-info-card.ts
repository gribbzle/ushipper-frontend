import { useMemo } from 'react';

import { useGetCompanyData } from '@hooks';

import { BusinessInfoCardFormType } from './business-info-card.types';

export const useInitialValuesBusinessInfoCard = () => {
    const { data } = useGetCompanyData();

    const initialValues = useMemo<BusinessInfoCardFormType>(() => {
        if (data) {
            const { specializations, businessHours } = data;

            return { specializations: specializations?.map(({ id }) => id), businessHours };
        }

        return {};
    }, [data]);

    return { initialValues };
};
