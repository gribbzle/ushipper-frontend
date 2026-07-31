import { OrderSortingDirection } from '@/enums';
import { CarModel, CarModelsFilters } from '@store/admin';
import { PaginatedData } from '@utils/redux';

import { apiSlice } from './api-slice';

const defaultCarModelsFilters: Partial<CarModelsFilters> = {
    page: 1,
    perPage: 20,
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
};

const carModelsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCarModelsByName: builder.query<CarModel[], string | null>({
            query: modelName => {
                const params: Partial<CarModelsFilters> = {
                    ...defaultCarModelsFilters,
                    modelName: modelName || undefined,
                };

                return {
                    method: 'get',
                    url: 'car-models',
                    params,
                };
            },
            transformResponse: (response: { data: PaginatedData<CarModel[]> }) => response.data.data,
        }),
    }),
});

export const { useGetCarModelsByNameQuery } = carModelsApi;
