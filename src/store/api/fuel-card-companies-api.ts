import { apiSlice } from './api-slice';

export type FuelCardCompany = string;

const fuelCardCompaniesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFuelCardCompanies: builder.query<FuelCardCompany[], void>({
            query: () => ({
                url: 'fuel-card-companies',
                method: 'get',
            }),
            transformResponse: (response: { data: FuelCardCompany[] }) => response.data,
        }),
    }),
});

export const { useGetFuelCardCompaniesQuery } = fuelCardCompaniesApi;
