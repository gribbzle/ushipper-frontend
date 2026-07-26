import { useMemo } from 'react';

import { convertCityToAbbreviation } from '@utils';

import { CompanyTypeAddressBlockProps } from './company-type-address-block.types';

export const useCompanyTypeAddressBlock = ({ city, state }: Omit<CompanyTypeAddressBlockProps, 'companyType'>) => {
    const address = useMemo(() => [city, state && convertCityToAbbreviation(state)].filter(Boolean).join(', '), [city, state]);

    return { address };
};
