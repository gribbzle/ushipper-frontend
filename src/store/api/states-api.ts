import { apiSlice } from './api-slice';

export type State = {
    title: string;
    alpha2: string;
};

const statesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getStates: builder.query<State[], { countryCode: string }>({
            query: ({ countryCode }) => ({
                url: `states?country=${countryCode}`,
                method: 'get',
            }),
            transformResponse: (response: { data: { data: State[] } }) => response.data.data,
        }),
    }),
});

export const { useGetStatesQuery } = statesApi;
