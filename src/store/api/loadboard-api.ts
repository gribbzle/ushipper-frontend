import { LoadboardTab, OrderSortingDirection, OrderSourcesEnum, TermsEnum, TransportTypeEnum, VehicleType } from '@enums';
import { apiSlice } from '@store/api/api-slice';
import { Load } from '@store/common/orders/types';
import { PaginatedResponse } from '@utils/redux';

export interface LoadBoardFilters {
    origins?: string[];
    destinations?: string[];
    pathStartLocation?: string;
    pathEndLocation?: string;
    distanceOffPath?: number;
    pathWaypoints?: string[];
    vehicleTypes?: VehicleType[];
    trailerTypes?: TransportTypeEnum[];
    vehicleInop?: number;
    vehiclesMinCount?: number;
    vehiclesMaxCount?: number;
    shippingReadyBefore?: number;
    paymentTerms?: TermsEnum[];
    sources?: OrderSourcesEnum[];
    customerName?: string;
    orderId?: string;
    minTotalPrice?: number;
    minPricePerKm?: number;
    newPostedOnTopAfter?: number;
    sortNames?: string[];
    sortDirections?: OrderSortingDirection[];
    page?: number;
    perPage?: number;
    hasOrderRequests?: number;
    hasAcceptedOffers?: number;
    hasDeclinedUserOrderStatus?: number;
    hasCalledUserOrderStatus?: number;
    hasFlags?: number;
    includeCompanyBlacklist?: boolean;
    includeGlobalBlacklist?: boolean;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface CoordinatesWithName extends Coordinates {
    name: string;
}

export interface CoordinatesWithRange extends CoordinatesWithName {
    distance: number;
}

export interface CoordinatesWithRangeRegion extends CoordinatesWithRange {
    region?: string;
    state?: string;
}

export interface SavedLoadBoardFilters {
    origins?: CoordinatesWithRangeRegion[];
    destinations?: CoordinatesWithRangeRegion[];
    pathStartLocation?: CoordinatesWithName;
    pathEndLocation?: CoordinatesWithName;
    pathWaypoints?: CoordinatesWithName[];
    distanceOffPath?: number;
    vehicleTypes?: VehicleType[];
    trailerTypes?: TransportTypeEnum[];
    vehicleInop?: number;
    vehiclesMinCount?: number;
    vehiclesMaxCount?: number;
    shippingReadyBefore?: number;
    paymentTerms?: TermsEnum[];
    sources?: OrderSourcesEnum[];
    customerName?: string;
    orderId?: string;
    minTotalPrice?: number;
    minPricePerKm?: number;
    newPostedOnTopAfter?: number;
    newPostedOnTop?: boolean;
    sortNames?: string[];
    sortDirections?: OrderSortingDirection[];
    includeCompanyBlacklist?: boolean;
    includeGlobalBlacklist?: boolean;
}

export type LoadboardStatistic = {
    statusCounters: { [key in LoadboardTab]: number };
};

//TODO Extract LoadboardOrder type and move loadboard-related types to a separate file
export const loadboardApi = apiSlice.injectEndpoints({
    endpoints: build => ({
        getLoadboardItems: build.query<PaginatedResponse<Load[]>, { filters: LoadBoardFilters; headers?: Record<string, string> }>({
            query: ({ filters, headers }) => {
                return {
                    url: 'load-board-orders',
                    method: 'get',
                    params: filters,
                    headers,
                };
            },
            transformResponse: (response: { data: PaginatedResponse<Load[]> }) => response.data,
            providesTags: [{ type: 'Loadboard', id: 'LIST' }],
        }),
        getLoadboardItem: build.query<Load, string>({
            query: id => {
                return {
                    url: `load-board-orders/${id}`,
                    method: 'get',
                };
            },
            transformResponse: (response: { data: Load }) => response.data,
            providesTags: result => [{ type: 'Loadboard', id: result?.publicId }],
        }),
        getLoadboardStatistic: build.query<LoadboardStatistic, { filters: LoadBoardFilters; headers?: Record<string, string> }>({
            query: ({ filters, headers }) => {
                return {
                    url: 'load-board-orders/statistics/counters',
                    method: 'get',
                    params: filters,
                    headers,
                };
            },
            transformResponse: (response: { data: LoadboardStatistic }) => response.data,
            providesTags: [{ type: 'Loadboard', id: 'Statistic' }],
        }),
    }),
});

export default loadboardApi;

export const { useGetLoadboardItemsQuery, useLazyGetLoadboardItemsQuery, useGetLoadboardStatisticQuery, useGetLoadboardItemQuery } = loadboardApi;
