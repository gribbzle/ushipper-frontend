import { BalanceType } from '@/enums/balance-type';
import { BalanceValue } from '@store/admin';

import { apiSlice } from './api-slice';

export type BalanceStatisticsData = {
    positiveAmount: BalanceValue;
    positiveCount: number;
    negativeAmount: BalanceValue;
    negativeCount: number;
};

type BalanceStatisticsFilters = Partial<{
    accountRole: 'administrator' | 'owner' | 'driver' | 'dispatcher';
    types: BalanceType[];
}>;

export const balanceStatisticsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBalanceStatistic: builder.query<BalanceStatisticsData, BalanceStatisticsFilters>({
            query: params => ({
                url: 'balance-statistics',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: BalanceStatisticsData }) => response.data,
            providesTags: ['BalanceStatistics'],
        }),
    }),
});

export const { useGetBalanceStatisticQuery } = balanceStatisticsApi;
