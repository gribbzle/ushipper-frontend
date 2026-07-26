import { Specialization } from '@store/common/specialization';
import { specializationsActions } from '@store/common/specialization/slice';

import { apiSlice } from './api-slice';

const specializationsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSpecializations: builder.query<Specialization[], void>({
            query: () => {
                return {
                    url: 'specializations',
                    method: 'get',
                };
            },
            onQueryStarted: (_, { queryFulfilled, dispatch }) => {
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(specializationsActions.setSpecializations(data));
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            transformResponse: (response: { data: { data: Specialization[] } }) => response.data.data,
        }),
    }),
});

export const { useGetSpecializationsQuery } = specializationsApi;
