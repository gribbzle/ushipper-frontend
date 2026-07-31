import { axios } from '@utils/axios';

import { Load, OrderFormState, OrderSendBOLFormState } from '../store/common/orders/types';

export const fetchOrder = async (publicId: string) => {
    const result = await axios.get<{ data: Load }>(`/api/orders/${publicId}`);

    return result.data.data;
};

export const updateOrder = async (data: OrderFormState) => {
    const result = await axios.patch<{ data: Load }>(`/api/orders/${data.publicId}`, data);

    return result.data.data;
};

export const createOrder = async (data: OrderFormState) => {
    const result = await axios.post<{ data: Load }>('/api/orders', data);

    return result.data.data;
};

export const sendOrderBOL = async (orderId: string, data: OrderSendBOLFormState) => {
    await axios.post(`/api/orders/${orderId}/bol/notifications`, data);
};
