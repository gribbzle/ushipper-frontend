import { OffersListTabsEnum, OfferSortingName, OfferStatusesEnum, OrderSortingDirection } from '@/enums';
import { apiSlice } from '@store/api/api-slice';
import { OrderOffer } from '@store/common/orders/types';
import { PaginatedResponse } from '@utils/redux';

type CreateOfferParams = {
    orderId: string;
    carrierCompanyId: string;
    orderRequestId?: string;
    paymentPrice: number;
    delayedPayment?: number | null;
    brokerFee?: number | null;
    pickupDateType: string;
    deliveryDateType: string;
    pickupAt: string;
    deliveryAt: string;
    contactName: string;
};

export type OffersFiltersParams = {
    orderName?: OfferSortingName;
    orderDirection?: OrderSortingDirection;
    status?: OfferStatusesEnum;
    carrierCompanyId?: string;
    shipperCompanyId?: string;
    searchQuery?: string;
    searchSubject?: string;
};

export type OffersStatistic = {
    [OffersListTabsEnum.All]: number;
    [OffersListTabsEnum.New]: number;
    [OffersListTabsEnum.Accepted]: number;
    [OffersListTabsEnum.Declined]: number;
    [OffersListTabsEnum.Canceled]: number;
};
export const orderOffersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOffer: builder.query<OrderOffer, string>({
            query: id => ({
                url: `order-offers/${id}`,
                method: 'get',
            }),
            transformResponse: (response: { data: OrderOffer }) => response.data,
            providesTags: result => [{ type: 'Offers', id: result?.publicId }],
        }),
        getOffers: builder.query<
            PaginatedResponse<OrderOffer[]>,
            {
                page: number;
                perPage: number;
            } & OffersFiltersParams
        >({
            query: params => ({
                url: 'order-offers',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<OrderOffer[]> }) => response.data,
            providesTags: [{ type: 'Offers', id: 'LIST' }],
        }),
        getOffersStatistic: builder.query<OffersStatistic, OffersFiltersParams>({
            query: params => ({
                url: 'order-offers/statistics/counters',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: OffersStatistic }) => response.data,
            providesTags: [{ type: 'OffersStats' }],
        }),
        createOffer: builder.mutation<OrderOffer, CreateOfferParams>({
            query: data => ({
                url: 'order-offers',
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: OrderOffer }) => response.data,
            invalidatesTags: [{ type: 'Offers', id: 'LIST' }, { type: 'OffersStats' }, { type: 'Requests', id: 'LIST' }],
        }),
        partiallyUpdateOffer: builder.mutation<OrderOffer, { publicOfferId: string; newOrderData: Partial<OrderOffer> }>({
            query: ({ publicOfferId, newOrderData: data }) => ({
                url: `order-offers/${publicOfferId}`,
                method: 'patch',
                data: data,
            }),
            invalidatesTags: result => [{ type: 'Offers', id: 'LIST' }, { type: 'OffersStats' }, { type: 'Offers', id: result?.publicId }],
        }),
        cancelOffer: builder.mutation<OrderOffer, string>({
            query: offerId => ({
                url: `order-offers/${offerId}`,
                method: 'patch',
                data: {
                    status: OfferStatusesEnum.CANCELED,
                },
            }),
        }),
    }),
});

export const {
    useGetOfferQuery,
    usePartiallyUpdateOfferMutation,
    useGetOffersQuery,
    useGetOffersStatisticQuery,
    useCreateOfferMutation,
    useCancelOfferMutation,
} = orderOffersApi;
