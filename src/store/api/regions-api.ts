import { RegionKeyEnum } from '@/enums/region-key-enum';

import { apiSlice } from './api-slice';

export type Region = {
    title: string;
    key: RegionKeyEnum;
    states: string[];
};

const regionsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRegions: builder.query<Region[], void>({
            query: () => ({
                url: 'regions',
                method: 'get',
            }),
            transformResponse: (response: { data: { data: Region[] } }) => response.data.data,
        }),
    }),
});

export const { useGetRegionsQuery } = regionsApi;
