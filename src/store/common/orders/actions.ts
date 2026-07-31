import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder, fetchOrder, sendOrderBOL, updateOrder } from '@api';

import { translateByNamespace } from '../../../utils/i18n';

import { ordersActions } from './slice';
import { Load, OrderFormState, OrderSendBOLFormState } from './types';

const t = (key: string) => translateByNamespace('client:order')(key);

export const orderFormSubmitAction = createAsyncThunk<Load, OrderFormState>('orders/orderFormSubmit', async (order, { rejectWithValue, dispatch }) => {
    try {
        const result = order.publicId ? await updateOrder(order) : await createOrder(order);

        dispatch(ordersActions.setOrderData(result));

        toast(t('success-updated-notification'));

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const orderSendBOLAction = createAsyncThunk<void, { orderId: string; data: OrderSendBOLFormState }, { rejectValue: unknown }>(
    'orders/orderSendBOL',
    async ({ orderId, data }, { rejectWithValue }) => {
        try {
            await sendOrderBOL(orderId, data);

            toast.success(t('send-bol.notifications.success-message'));
        } catch (error) {
            toast.error(t('send-bol.notifications.error-message'));

            return rejectWithValue(error);
        }
    },
);

export const fetchOrderAction = createAsyncThunk<any, string>('orders/fetchOrder', async (data, { rejectWithValue }) => {
    try {
        return await fetchOrder(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});
