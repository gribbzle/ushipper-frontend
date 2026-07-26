import {
    AttachmentType,
    CommodityDimensionUnitEnum,
    CommodityHazmatClassEnum,
    CommodityPackingGroupEnum,
    CommodityTemperatureUnitEnum,
    CommodityTypesEnum,
    CommodityVolumeUnitEnum,
    CommodityWeightUnitEnum,
    DateTypes,
    FreightClassesEnum,
    FundsTransferCalculatedStatus,
    InspectionType,
    InstantTermPaymentType,
    OrderPaymentStatus,
    OrderSortingDirection,
    OrderSortingName,
    OrderStatisticsGroup,
    OrderStatisticsStatus,
    OrderStatus,
    OrderType,
    TransportTypeEnum,
} from '@/enums';
import { Attachment, NullableFields } from '@/shared';
import { BalanceValue } from '@store/admin';
import { OrderExpense } from '@store/api/order-expenses-api';
import { ExternalCompany, Load, OrderFormState, OrderPaymentInformation, ordersActions, OrderSignature } from '@store/client';
import { CursorPagination, PaginatedResponse } from '@utils';

import { User } from '../common';

import { apiSlice } from './api-slice';
import { OrderInternalNote } from './order-internal-notes-api';

export type DeliveryInformation = NullableFields<{
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    scheduledDeliveryAt: string;
    notes: string;
    fullName: string;
    phone: string;
    email: string;
    driverSignature: OrderSignature;
    customerSignature: OrderSignature;
    saveAsNewContact: boolean;
    deliveryDateType?: DateTypes;
}>;

export type CustomerInformation = NullableFields<{
    customerName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    fullName: string;
    phone: string;
    email: string;
    externalCompany?: ExternalCompany;
    businessType?: string;
}>;

export type PaymentInformation = OrderPaymentInformation;

export type OrderVehicle = {
    id: number;
    vin: string | null;
    year: number | null;
    make: string | null;
    model: string | null;
    type: string;
    color: string | null;
    lotNumber: string | null;
    price: number | null;
    inop: boolean;
    enclosed: boolean;
    schematicPhoto: string;
    weight: number | null;
    height: number | null;
    length: number | null;
    width: number | null;
};

export type OrderCommodity = {
    publicId: string;
    freightClass: FreightClassesEnum;
    type: CommodityTypesEnum | null;
    weight: number | null;
    weightUnit: CommodityWeightUnitEnum | null;
    volume: string | null;
    volumeUnit: CommodityVolumeUnitEnum | null;
    linearFeet: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    dimensionUnit: CommodityDimensionUnitEnum | null;
    minTemperature: number | null;
    maxTemperature: number | null;
    temperatureUnit: CommodityTemperatureUnitEnum | null;
    packingGroup: CommodityPackingGroupEnum | null;
    hazmatClass: CommodityHazmatClassEnum | null;
    name: string | null;
    description: string | null;
    nmfcCode: string | null;
    stackable: boolean;
    hazardous: boolean;
    quantity: number | null;
    pieces: number | null;
    skuNumber: string | null;
    properShippingName: string | null;
    emergencyContact: string | null;
    unNumber: number | null;
    createdAt: string;
    updatedAt: string;
};

export type OrderVehicleParam = Partial<OrderVehicle>;

type DuplicateLoadParam = Omit<Load, 'vehicles'> & {
    vehicles: OrderVehicleParam[];
};

export type PickupInformation = NullableFields<{
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    scheduledPickupAt: string;
    buyerNumber: string;
    notes: string;
    fullName: string;
    phone: string;
    email: string;
    driverSignature: OrderSignature;
    customerSignature: OrderSignature;
    pickupDateType?: DateTypes;
}>;

export type OrderDetails = NullableFields<{
    orderId: string;
    internalOrderId: string;
    inspectionType: InspectionType;
    driverInstructions?: string;
    instructions?: string;
    trailerType?: TransportTypeEnum;
}>;

export type Order = {
    publicId: string;
    customerInformation: CustomerInformation;
    deliveryInformation: DeliveryInformation;
    details: OrderDetails;
    expenses: OrderExpense[];
    pickupInformation: PickupInformation;
    vehicles: OrderVehicle[];
    paymentInformation: PaymentInformation;
    driver: User | null;
    dispatcher: User | null;
    archivedAt: string | null;
    deletedAt: string | null;
    latestInternalNote: OrderInternalNote;
    paymentStatus: OrderPaymentStatus;
    status: OrderStatus;
    sendInvoiceAt: string | null;
    paidAt: string | null;
    isFlagged: boolean;
};

type StatusCounters = Partial<{
    assigned: number;
    pickedUp: number;
    deliveredPendingSum: BalanceValue;
}> &
    Record<string, number | BalanceValue | undefined>;

export type StatisticsCounters = {
    groupCounters: Record<string, number>;
    statusCounters: StatusCounters;
};

type OrderFilters = Partial<{
    searchSubject: string;
    search: string;
    dispatchers: string[];
    driverAccountId: string[];
    ownerAccountId: string;
}>;

export type FundsTransferCalculatedStatusesType = 'pending' | 'not_paid' | 'pending_documents' | 'damage_claim' | 'paid';

export type GetOrdersData = OrderFilters &
    Partial<{
        page: number;
        perPage: number;
        orderName: OrderSortingName;
        orderDirection: OrderSortingDirection;
        statisticsGroup: OrderStatisticsGroup;
        statisticsStatus: OrderStatisticsStatus | OrderStatisticsStatus[];
        hasOrderRequests: number;
        companyPublicId: string;
        type: OrderType;
        fundsTransferStatus: string;
        createdAtFrom: string;
        createdAtTo: string;
        fundsTransferCalculatedStatus: FundsTransferCalculatedStatus;
        drivers: string[];
        instantTermPaymentType: InstantTermPaymentType;
        instantTermPaymentTypeSet: boolean;
        statuses: OrderStatus[];
    }>;

type GetOrderAttachmentsData = GetOrderAttachmentsParams &
    Partial<{
        orderId: string;
        type: AttachmentType;
    }>;

export type GetOrderAttachmentsParams = Partial<{
    orderName: string;
    orderDirection: OrderSortingDirection;
    perPage: number;
    cursor: string | null;
}>;

export type GetOrderAttachmentsResponse = {
    attachments: Attachment[];
    nextCursor: string | null;
};

export type GetOrderRequestedDocument = {
    id: string;
    title: string;
    attachment: null | Attachment;
    createdAt: string;
};

export type CreateRequestedDocumentPayload = {
    title: string;
};

const serializeOrderAttachments = (data: { attachments?: Array<File>; cdContract?: Array<File>; bolAttachments?: Array<File>; [key: string]: any }) => {
    const orderCopy = { ...data };

    if (orderCopy.attachments) {
        delete orderCopy.attachments;
    }

    if (orderCopy.cdContract) {
        delete orderCopy.cdContract;
    }

    if (orderCopy.bolAttachments) {
        delete orderCopy.bolAttachments;
    }
    if (orderCopy.podAttachments) {
        delete orderCopy.podAttachments;
    }

    return orderCopy;
};

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrders: builder.query<PaginatedResponse<Load[]>, GetOrdersData>({
            query: filters => {
                return {
                    url: 'orders',
                    method: 'get',
                    params: filters,
                };
            },
            providesTags: result =>
                result
                    ? [...result.data.map(({ publicId }) => ({ type: 'Orders' as const, id: publicId })), { type: 'Orders', id: 'LIST' }]
                    : [{ type: 'Orders', id: 'LIST' }],
            transformResponse: (response: { data: PaginatedResponse<Load[]> }) => response.data,
        }),
        getOrder: builder.query<Load, string>({
            query: publicId => ({
                url: `orders/${publicId}`,
                method: 'get',
            }),
            providesTags: (_response, _error, publicId) => [{ type: 'Orders', id: publicId }],
            transformResponse: (response: { data: Load }) => response.data,
        }),
        createOrder: builder.mutation<Load, Omit<OrderFormState, 'publicId'>>({
            query: data => {
                return {
                    url: 'orders',
                    method: 'post',
                    data: serializeOrderAttachments(data),
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    formData: true,
                };
            },
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
            transformResponse: (response: { data: Load }) => response.data,
        }),
        updateOrder: builder.mutation<Load, OrderFormState>({
            query: ({ publicId, ...data }) => ({
                url: `orders/${publicId}`,
                method: 'patch',
                data: serializeOrderAttachments(data),
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Orders', id: arg.publicId }, { type: 'OrdersStatisticsCounters' }],
            transformResponse: (response: { data: Load }) => response.data,
        }),
        parseOrderFile: builder.mutation<void, File>({
            query: file => ({
                url: 'orders/parse-files',
                method: 'post',
                data: { file },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        }),
        deleteOrder: builder.mutation<void, string>({
            query: publicId => ({
                url: `orders/${publicId}`,
                method: 'delete',
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
        }),
        duplicateOrder: builder.mutation<Load, DuplicateLoadParam>({
            query: order => ({
                url: 'orders',
                method: 'post',
                data: order,
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
            transformResponse: (response: { data: Load }) => response.data,
        }),
        partiallyUpdateOrder: builder.mutation<Load, { publicOrderId: string; newOrderData: OrderFormState }>({
            query: ({ publicOrderId, newOrderData: data }) => ({
                url: `orders/${publicOrderId}`,
                method: 'patch',
                data: data,
            }),
            invalidatesTags: result => [
                { type: 'Loadboard', id: 'Statistic' },
                { type: 'Orders', id: 'LIST' },
                { type: 'OrdersStatisticsCounters' },
                { type: 'Orders', id: result?.publicId },
            ],
            transformResponse: (response: { data: Load }) => response.data,
        }),
        createOrderAttachment: builder.mutation<Attachment, { orderId: string; file: File; type?: AttachmentType }>({
            query: ({ orderId, file, type }) => ({
                url: `orders/${orderId}/attachments`,
                method: 'post',
                data: {
                    file,
                    type,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            onQueryStarted({ orderId, type }, { queryFulfilled, dispatch }) {
                queryFulfilled.then(({ data }) => {
                    dispatch(
                        ordersApi.util.updateQueryData('getOrderAttachments', { orderId, type }, draftAttachments => {
                            draftAttachments.attachments.unshift(data);
                        }),
                    );
                });
            },
            transformResponse: (response: { data: Attachment }) => response.data,
        }),
        getOrderAttachments: builder.query<GetOrderAttachmentsResponse, GetOrderAttachmentsData>({
            query: ({ orderId, ...params }) => ({
                url: `orders/${orderId}/attachments`,
                method: 'get',
                params,
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { orderId, type } = queryArgs;

                return type ? `${endpointName}("${orderId}"-"${type}")` : `${endpointName}("${orderId}")`;
            },
            transformResponse: (response: { data: CursorPagination<Attachment[]> }) => ({
                attachments: response.data.data,
                nextCursor: response.data.meta.nextCursor,
            }),
        }),
        removeOrderAttachment: builder.mutation<unknown, { orderId: string; attachmentId: string; type?: AttachmentType }>({
            query: ({ orderId, attachmentId }) => ({
                url: `orders/${orderId}/attachments/${attachmentId}`,
                method: 'delete',
            }),
            onQueryStarted({ orderId, attachmentId, type }, { queryFulfilled, dispatch }) {
                queryFulfilled.then(() => {
                    dispatch(
                        ordersApi.util.updateQueryData('getOrderAttachments', { orderId, type }, draftAttachments => {
                            draftAttachments.attachments = draftAttachments.attachments.filter(attachment => attachment.publicId !== attachmentId);
                        }),
                    );
                });
            },
        }),
        getOrdersStatisticsCounters: builder.query<StatisticsCounters, OrderFilters>({
            query: params => ({
                url: 'orders/statistics/counters',
                method: 'get',
                params,
            }),
            providesTags: ['OrdersStatisticsCounters'],
            transformResponse: (response: { data: StatisticsCounters }) => response.data,
        }),
        updateDriver: builder.mutation<Order, { orderPublicId: string; body: { driverId: string | null } }>({
            query: ({ orderPublicId, body }) => {
                return {
                    url: `orders/${orderPublicId}`,
                    method: 'patch',
                    data: body,
                };
            },
            onQueryStarted: (arg, { queryFulfilled, dispatch }) => {
                queryFulfilled
                    .then(({ data }) => {
                        // TODO: reconcile types and/or get rid of async thunks in favour to rtk query
                        dispatch(ordersActions.setOrderData(data as unknown as Load));
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            transformResponse: (response: { data: Order }) => response.data,
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
        }),
        createOrderFlag: builder.mutation<void, { publicOrderId: string }>({
            query: ({ publicOrderId }) => ({
                url: `orders/${publicOrderId}/flag`,
                method: 'post',
            }),
            invalidatesTags: [
                { type: 'Orders', id: 'LIST' },
                { type: 'Loadboard', id: 'Statistic' },
            ],
        }),
        deleteOrderFlag: builder.mutation<void, { publicOrderId: string }>({
            query: ({ publicOrderId }) => ({
                url: `orders/${publicOrderId}/flag`,
                method: 'delete',
            }),
            invalidatesTags: [
                { type: 'Orders', id: 'LIST' },
                { type: 'Loadboard', id: 'Statistic' },
            ],
        }),
        createOrderCall: builder.mutation<void, { publicOrderId: string }>({
            query: ({ publicOrderId }) => ({
                url: `orders/${publicOrderId}/calls`,
                method: 'post',
            }),
            invalidatesTags: [{ type: 'Loadboard', id: 'Statistic' }],
        }),
        getOrderRequestedDocuments: builder.query<GetOrderRequestedDocument[], GetOrderAttachmentsData>({
            query: ({ orderId, ...params }) => ({
                url: `orders/${orderId}/requested-documents`,
                method: 'get',
                params,
            }),
            providesTags: (_result, _error, { orderId }) => [{ type: 'RequestedDocuments', id: orderId }],
            transformResponse: (response: { data: GetOrderRequestedDocument[] }) => response.data,
        }),
        createOrderRequestedDocuments: builder.mutation<Attachment, { orderId: string; requestId: string; file: File }>({
            query: ({ orderId, file, requestId }) => ({
                url: `orders/${orderId}/requested-documents/${requestId}/attachments`,
                method: 'post',
                data: {
                    file,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            transformResponse: (response: { data: Attachment }) => response.data,
        }),
        createRequestedDocuments: builder.mutation<GetOrderRequestedDocument, { orderPublicId: string; data: CreateRequestedDocumentPayload }>({
            query: ({ orderPublicId, data }) => ({
                url: `orders/${orderPublicId}/requested-documents`,
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: GetOrderRequestedDocument }) => response.data,
        }),
        recalculateOrderTransactions: builder.mutation<void, { publicId: string; cancellationNotes: string }>({
            query: ({ publicId, cancellationNotes }) => ({
                url: `orders/${publicId}/recalculate-transactions`,
                method: 'post',
                data: {
                    cancellationNotes,
                },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Orders', id: arg.publicId }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersStatisticsCountersQuery,
    useGetOrderQuery,
    useRemoveOrderAttachmentMutation,
    useUpdateOrderMutation,
    useDuplicateOrderMutation,
    useGetOrdersQuery,
    useLazyGetOrdersQuery,
    useLazyGetOrderQuery,
    useDeleteOrderMutation,
    useUpdateDriverMutation,
    usePartiallyUpdateOrderMutation,
    useCreateOrderFlagMutation,
    useDeleteOrderFlagMutation,
    useCreateOrderAttachmentMutation,
    useGetOrderAttachmentsQuery,
    useLazyGetOrderAttachmentsQuery,
    useParseOrderFileMutation,
    useCreateOrderCallMutation,
    useGetOrderRequestedDocumentsQuery,
    useCreateOrderRequestedDocumentsMutation,
    useCreateRequestedDocumentsMutation,
    useRecalculateOrderTransactionsMutation,
} = ordersApi;
