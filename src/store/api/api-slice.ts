import { AxiosError, AxiosRequestConfig } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import { axios } from '@utils';

export const axiosBaseQuery =
    ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }): BaseQueryFn<AxiosRequestConfig> =>
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await axios({ url: baseUrl + url, method, data, params, headers });

            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;

            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({ baseUrl: '/api/' }),
    endpoints: () => ({}),
    keepUnusedDataFor: 0,
    tagTypes: [
        'Orders',
        'OrderAttachment',
        'OrdersStatisticsCounters',
        'OrderVehicle',
        'OrderCommodity',
        'OrderExpense',
        'Offers',
        'OffersStats',
        'Requests',
        'Reviews',
        'Loadboard',
        'Contacts',
        'JobOffers',
        'JobOffersStats',
        'Dispatchers',
        'DispatchersStats',
        'Carriers',
        'CarriersStats',
        'Roles',
        'Users',
        'FinancialBalances',
        'AccountingEntity',
        'FeeCategories',
        'Companies',
        'Accounts',
        'RocketkorDocuments',
        'AccountingProfile',
        'Transactions',
        'RequestedDocuments',
        'AccountingAccounts',
        'BalanceStatistics',
        'Issues',
        'IssuesStats',
        'FuelCards',
        'FuelTransactions',
        'TrackingOrders',
        'TrackingDrivers',
    ],
});
