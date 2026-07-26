import { apiSlice } from './api-slice';

export type DriverPaymentRequestsCounterData = {
    count: number;
};

export const driverPaymentRequestsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDriverPaymentRequestsCounter: builder.query<DriverPaymentRequestsCounterData, void>({
            query: () => ({
                url: 'driver-payment-requests/counter',
                method: 'get',
            }),
            transformResponse: (response: { data: DriverPaymentRequestsCounterData }) => response.data,
        }),
    }),
});

export const { useLazyGetDriverPaymentRequestsCounterQuery } = driverPaymentRequestsApi;
