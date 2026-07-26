import { apiSlice } from './api-slice';

export type CheckVinResponse = {
    maker: { id: number; name: string };
    model: { id: number; name: string };
    year: string;
};

const vinApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        verifyVin: builder.mutation<CheckVinResponse, string>({
            query: vin => ({
                url: 'vin/verify',
                method: 'post',
                data: { vin },
            }),
            transformResponse: (response: { data: CheckVinResponse }) => response.data,
        }),
    }),
});

export const { useVerifyVinMutation } = vinApi;
