import { useGetCountriesQuery } from '@store/api/countries-api';
import { useGetStatesQuery } from '@store/api/states-api';

const DEFAULT_STATIC_COUNTRY_CODE = 'USA';

export const useCountriesAndStates = (countryCode?: string) => {
    const { data: countries } = useGetCountriesQuery();
    const { data: states } = useGetStatesQuery({ countryCode: countryCode ?? DEFAULT_STATIC_COUNTRY_CODE });

    return {
        states,
        countries,
    };
};
