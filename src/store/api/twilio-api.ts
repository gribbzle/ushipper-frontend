import { apiSlice } from './api-slice';

type TwilioTokenResponseDto = {
    token: string;
};

export const usersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getToken: builder.query<string, void>({
            query: params => {
                return {
                    url: 'twilio/tokens',
                    method: 'POST',
                    params,
                };
            },
            transformResponse: (response: { data: TwilioTokenResponseDto }) => response.data.token,
        }),
    }),
});

export const { useGetTokenQuery } = usersApi;
