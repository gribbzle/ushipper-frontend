import { TrackingDriverStatus } from '@/enums/tracking/tracking-driver-status';
import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { apiSlice } from '@store/api/api-slice';
import { ShipperTrackingOrder, TrackingDriver, TrackingOrderGrouping } from '@store/client/tracking/types';
import { User } from '@store/common/staff/types';

export type TrackingOrdersFilters = Partial<{
    search: string;
    dispatchers: string[];
    searchSubject: string;
    status: TrackingOrderStatus[];
    grouping: TrackingOrderGrouping;
    driverFlagged: boolean;
    perPage: number;
    orderName: string;
    orderDirection: string;
    page: number;
    cursor: string | null;
}>;

export type TrackingOrdersByStatusData = {
    status: TrackingOrderStatus;
    orders: ShipperTrackingOrder[];
};

export type TrackingOrdersByDispatcherData = {
    dispatcher: User;
    orders: ShipperTrackingOrder[];
};

export type TrackingDriversFilters = {
    orderId: string;
    status?: TrackingDriverStatus;
    radius?: number;
};

export const trackingApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTrackingOrders: builder.query<(TrackingOrdersByStatusData | TrackingOrdersByDispatcherData)[], Partial<TrackingOrdersFilters>>({
            query: params => {
                return {
                    url: 'tracking/orders',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: (TrackingOrdersByStatusData | TrackingOrdersByDispatcherData)[] }) => response.data,
            providesTags: [{ type: 'TrackingOrders', id: 'LIST' }],
        }),
        getTrackingDrivers: builder.query<TrackingDriver[], TrackingDriversFilters>({
            query: params => {
                return {
                    url: 'tracking/drivers',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: { data: TrackingDriver[] } }) => response.data.data,
            providesTags: (result, error, arg) => [
                { type: 'TrackingDrivers', id: 'LIST' },
                { type: 'TrackingDrivers', id: arg.orderId },
            ],
        }),
        getTrackingDriver: builder.query<TrackingDriver, string>({
            query: driverPublicId => {
                return {
                    url: `tracking/drivers/${driverPublicId}`,
                    method: 'GET',
                };
            },
            providesTags: (_response, _error, publicId) => [{ type: 'TrackingDrivers', id: publicId }],
            transformResponse: (response: { data: { data: TrackingDriver } }) => response.data.data,
        }),
    }),
});

export const { useGetTrackingOrdersQuery, useGetTrackingDriversQuery, useGetTrackingDriverQuery } = trackingApi;
