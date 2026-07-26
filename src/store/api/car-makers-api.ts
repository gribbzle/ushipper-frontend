import { OrderSortingDirection } from '@/enums';
import { CarMaker, CarMakersFilters } from '@store/admin';
import { PaginatedData } from '@utils';

import { apiSlice } from './api-slice';

const defaultCarMakersFilters: Partial<CarMakersFilters> = {
    page: 1,
    perPage: 20,
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
};

const carMakersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCarMakersByName: builder.query<CarMaker[], string | null>({
            query: name => {
                const params: Partial<CarMakersFilters> = {
                    ...defaultCarMakersFilters,
                    name: name || undefined,
                };

                return {
                    url: 'car-makers',
                    method: 'get',
                    params,
                };
            },
            transformResponse: (response: { data: PaginatedData<CarMaker[]> }) => response.data.data,
        }),
    }),
});

export const { useGetCarMakersByNameQuery } = carMakersApi;
