import { CompanyType } from '@/enums/company-type';
import { apiSlice } from '@store/api/api-slice';
import {
    BaseCatalogFiltersParams,
    CarriersCatalogInfo,
    CarriersCatalogStatisticsCounters,
    DispatcherCatalogInfo,
    DispatcherCatalogStatisticsCounters,
} from '@store/client/catalogs/types';
import { PaginatedResponse } from '@utils/redux';

export const catalogsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDispatchersCatalog: builder.query<PaginatedResponse<DispatcherCatalogInfo[]>, BaseCatalogFiltersParams>({
            query: params => ({
                url: 'v2/dispatchers',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<DispatcherCatalogInfo[]> }) => response.data,
            providesTags: [{ type: 'Dispatchers', id: 'LIST' }],
        }),
        getDispatchersCatalogStatistic: builder.query<DispatcherCatalogStatisticsCounters, BaseCatalogFiltersParams | null>({
            query: params => ({
                url: 'v2/dispatchers/statistics/counters',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: DispatcherCatalogStatisticsCounters }) => response.data,
            providesTags: [{ type: 'DispatchersStats' }],
        }),
        getDriversCatalog: builder.query<PaginatedResponse<DispatcherCatalogInfo[]>, BaseCatalogFiltersParams>({
            query: params => ({
                url: 'v2/drivers',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<DispatcherCatalogInfo[]> }) => response.data,
            providesTags: [{ type: 'Dispatchers', id: 'LIST' }],
        }),
        getDriversCatalogStatistic: builder.query<DispatcherCatalogStatisticsCounters, BaseCatalogFiltersParams | null>({
            query: params => ({
                url: 'v2/drivers/statistics/counters',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: DispatcherCatalogStatisticsCounters }) => response.data,
            providesTags: [{ type: 'DispatchersStats' }],
        }),
        getCarriersCatalog: builder.query<PaginatedResponse<CarriersCatalogInfo[]>, BaseCatalogFiltersParams>({
            query: params => ({
                url: 'companies',
                method: 'get',
                params: { ...params, type: CompanyType.CARRIER },
            }),
            transformResponse: (response: { data: PaginatedResponse<CarriersCatalogInfo[]> }) => response.data,
            providesTags: [{ type: 'Carriers', id: 'LIST' }],
        }),
        getCarriersCatalogStatistic: builder.query<CarriersCatalogStatisticsCounters, BaseCatalogFiltersParams | null>({
            query: params => ({
                url: 'companies/statistics/counters',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: CarriersCatalogStatisticsCounters }) => response.data,
            providesTags: [{ type: 'CarriersStats' }],
        }),
    }),
});

export const {
    useGetDispatchersCatalogQuery,
    useGetDispatchersCatalogStatisticQuery,
    useGetCarriersCatalogQuery,
    useGetCarriersCatalogStatisticQuery,
    useGetDriversCatalogQuery,
    useGetDriversCatalogStatisticQuery,
} = catalogsApi;
