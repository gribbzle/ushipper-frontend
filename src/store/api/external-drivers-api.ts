import { apiSlice } from './api-slice';

export type EXternalDriver = {
    guid: string;
    email: string;
    phone: string | null;
    nullable: true;
    name: string;
};

export const externalDriversApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExternalDrivers: builder.query<EXternalDriver[], void>({
            query: params => {
                return {
                    url: 'external-drivers',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: { data: EXternalDriver[] } }) => response.data.data,
        }),
    }),
});

export const { useGetExternalDriversQuery } = externalDriversApi;
