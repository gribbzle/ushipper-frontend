import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchOrderBOL } from '@api/orderBOL';
import { OrderBOL } from '@store/api/order-bol-api';

export const fetchOrderBOLAction = createAsyncThunk<OrderBOL, string>('orderBOL/fetchOrderBOL', async (orderId, { rejectWithValue }) => {
    try {
        return await fetchOrderBOL(orderId);
    } catch (error) {
        return rejectWithValue(error);
    }
});
