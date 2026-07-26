import { Attachment, NullableFields } from '@/shared';
import { PaginatedResponse } from '@utils';

import { apiSlice } from './api-slice';
import { CustomerInformation, DeliveryInformation, OrderVehicle, PaymentInformation, PickupInformation } from './orders-api';

type InvoiceCustomerInformation = Omit<CustomerInformation, 'fullName'>;

type InvoiceDeliveryInformation = Pick<DeliveryInformation, 'businessName' | 'city' | 'state' | 'streetAddress' | 'zip'>;

type InvoicePickupInformation = Pick<PickupInformation, 'businessName' | 'city' | 'state' | 'streetAddress' | 'zip'>;

type InvoicePaymentInformation = Pick<PaymentInformation, 'payment' | 'method'>;

type InvoiceSender = NullableFields<{
    address: string;
    city: string;
    email: string;
    mcNumber: unknown | null;
    name: string;
    phone: string;
    state: string;
    zip: string;
}>;

type InvoiceVehicle = Omit<OrderVehicle, 'enclosed'>;

type Invoice = {
    publicId: string;
    invoiceAt: string;
    invoiceId: string | null;
    payment: unknown | null;
    paymentAt: string | null;
    paymentStatus: unknown | null;
    paymentInformation: InvoicePaymentInformation;
    customerInformation: InvoiceCustomerInformation;
    deliveryInformation: InvoiceDeliveryInformation;
    pickupInformation: InvoicePickupInformation;
    sender: InvoiceSender;
    vehicles: InvoiceVehicle[];
    createdAt: string;
    attachment: Attachment;
};

export type OrderSendInvoiceFormState = Partial<{
    invoiceId: string;
    invoiceAt: string;
    email: string;
}>;

const orderInvoiceApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderInvoices: builder.query<PaginatedResponse<Invoice[]>, string>({
            query: orderId => ({
                url: `orders/${orderId}/invoices`,
                method: 'get',
                params: {
                    orderName: 'created_at',
                    orderDirection: 'desc',
                },
            }),
            transformResponse: (response: { data: PaginatedResponse<Invoice[]> }) => response.data,
        }),
        createOrderInvoice: builder.mutation<Invoice, string>({
            query: publicOrderId => ({
                url: `orders/${publicOrderId}/invoices`,
                method: 'post',
            }),
            transformResponse: (response: { data: Invoice }) => response.data,
        }),
        sendOrderInvoice: builder.mutation<unknown, { publicOrderId: string; invoiceId: string; data: OrderSendInvoiceFormState }>({
            query: ({ publicOrderId, invoiceId, data }) => ({
                url: `orders/${publicOrderId}/invoices/${invoiceId}/notifications`,
                method: 'post',
                data,
            }),
            invalidatesTags: ['Orders', 'OrdersStatisticsCounters'],
            transformResponse: (response: { data: unknown }) => response.data,
        }),
        getOrderInvoice: builder.query<Invoice, { publicOrderId: string; invoiceId: string }>({
            query: ({ publicOrderId, invoiceId }) => ({
                url: `orders/${publicOrderId}/invoices/${invoiceId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: Invoice }) => response.data,
        }),
    }),
});

export const { useCreateOrderInvoiceMutation, useSendOrderInvoiceMutation, useLazyGetOrderInvoicesQuery, useLazyGetOrderInvoiceQuery } = orderInvoiceApi;
