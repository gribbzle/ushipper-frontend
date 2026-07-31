import { PaymentTerm } from '@/store/common/payment-terms/types';
import { paymentTermsActions } from '@store/common/payment-terms/slice';

import { apiSlice } from './api-slice';

const paymentTermsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPaymentTerms: builder.query<PaymentTerm[], void>({
            query: () => {
                return {
                    url: 'payment-terms',
                    method: 'get',
                };
            },
            onQueryStarted: (_, { queryFulfilled, dispatch }) => {
                queryFulfilled
                    .then(({ data }) => {
                        dispatch(paymentTermsActions.setPaymentTerms(data));
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            transformResponse: (response: { data: PaymentTerm[] }) => response.data,
        }),
    }),
});

export const { useGetPaymentTermsQuery } = paymentTermsApi;
