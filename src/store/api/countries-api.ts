import { apiSlice } from './api-slice';

export type Country = {
    title: string;
    alpha2: string;
    alpha3: string;
};

const countriesApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getCountries: builder.query<Country[], void>({
            query: () => ({
                url: 'countries',
                method: 'get',
            }),
            transformResponse: (response: { data: { data: Country[] } }) => response.data.data,
        }),
    }),
});

export const { useGetCountriesQuery } = countriesApi;
