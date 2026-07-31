import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ordersApi } from '@store/api/orders-api';

import {
    BaseOrderPopupState,
    CreateEditInternalNotePopupState,
    DeleteInternalNotePopupState,
    DeleteOrderAttachmentPopupState,
    DeleteOrderCommodityPopupState,
    DeleteOrderExpensePopupState,
    DeleteOrderPopupState,
    DeleteOrderVehiclePopupState,
    Load,
    MarkAsDeliveredPopupState,
    MarkAsDocumentsRequestedPopupState,
    MarkAsNewPopupState,
    MarkAsPickedUpPopupState,
    OrderActivityDetailsDrawerState,
    OrderChatDrawerState,
    OrderCommodityDrawerState,
    OrderCustomerInformationDrawerState,
    OrderDeliveryInformationDrawerState,
    OrderDetailsDrawerState,
    OrderDriverInstructionsDrawerState,
    OrderDriverPaymentFormDrawerDrawerState,
    OrderExpenseDrawerState,
    OrderMarkAsPaidDrawerState,
    OrderPaymentInformationDrawerState,
    OrderPickupInformationDrawerState,
    OrderSendBOLDrawerState,
    OrderSendInvoiceDrawerState,
    OrderSendOfferToCarrierDrawerState,
    OrderSetDispatcherDrawerState,
    OrderSetDriverDrawerState,
    OrdersSliceState,
    OrderVehicleDrawerState,
    RecalculateOrderTransactionsPopupState,
    RestoreOrderPopupState,
    UnasignDriverPopupState,
} from './types';

export const getBaseOrderPopupInitialState = (): BaseOrderPopupState => ({ isVisible: false, publicOrderId: null });

const initialState: OrdersSliceState = {
    order: null,

    pickupInformationDrawer: {
        isVisible: false,
    },
    deliveryInformationDrawer: {
        isVisible: false,
    },
    customerInformationDrawer: {
        isVisible: false,
        customerName: null,
        streetAddress: null,
        city: null,
        state: null,
        zip: null,
        fullName: null,
        phone: null,
        email: null,
        mcNumber: null,
        businessType: null,
    },
    orderExpenseDrawer: {
        isVisible: false,
        expenseId: null,
    },
    paymentInformationDrawer: {
        isVisible: false,
        payment: null,
        brokerFee: null,
        method: null,
        terms: null,
        delayedPayment: null,
        delayedTerms: null,
        delayedMethod: null,
        driverPay: null,
        notes: null,
        invoiceId: null,
        invoiceNotes: null,
    },
    orderVehicleDrawer: {
        isVisible: false,
        vehicleId: null,
    },
    orderCommodityDrawer: {
        isVisible: false,
        commodityId: null,
    },
    driverInstructionsDrawer: {
        isVisible: false,
    },
    driverDrawer: {
        isVisible: false,
        orderId: null,
    },
    dispatcherDrawer: {
        isVisible: false,
        orderId: null,
    },
    markAsPaidDrawer: {
        isVisible: false,
        orderId: null,
    },
    sendBOLDrawer: {
        isVisible: false,
        orderId: null,
    },
    sendInvoiceDrawer: {
        isVisible: false,
        customerName: null,
        publicOrderId: null,
    },
    orderDetailsDrawer: {
        isVisible: false,
    },
    orderActivityDetailsDrawer: {
        isVisible: false,
        details: null,
        creatorName: null,
        createdAt: null,
    },
    sendOfferToCarrierDrawer: {
        isVisible: false,
        orderId: null,
    },
    orderChatDrawer: {
        isVisible: false,
        orderPublicId: null,
    },
    driverPaymentFormDrawer: {
        isVisible: false,
        orderId: null,
        attachment: null,
        instantTermPaymentType: null,
        instantTermPaymentMethod: null,
    },
    editOrderAttachmentsIdsToDelete: null,
    unasignDriverPopup: getBaseOrderPopupInitialState(),
    markAsNewPopup: getBaseOrderPopupInitialState(),
    markAsPickedUpPopup: getBaseOrderPopupInitialState(),
    markAsDeliveredPopup: getBaseOrderPopupInitialState(),
    deleteOrderPopupState: { ...getBaseOrderPopupInitialState(), orderId: null },
    restoreOrderPopup: getBaseOrderPopupInitialState(),
    isCreateOrderFromFileLoading: false,
    deleteInternalNotePopup: {
        isVisible: false,
        internalNoteId: null,
        publicOrderId: null,
    },
    createEditInternalNotePopup: {
        isVisible: false,
        internalNoteId: null,
        publicOrderId: null,
        initialText: '',
        mode: null,
    },
    deleteOrderVehiclePopup: {
        isVisible: false,
        vehicleId: null,
        vehicleMake: null,
        vehicleModel: null,
    },
    deleteOrderCommodityPopup: {
        isVisible: false,
        commodityId: null,
        commodityName: null,
        commodityDescription: null,
    },
    deleteOrderExpensePopup: {
        isVisible: false,
        expenseId: null,
        expenseType: null,
    },
    deleteOrderAttachmentPopup: {
        isVisible: false,
        attachmentToDelete: null,
        orderPublicId: null,
    },
    recalculateOrderTransactionsPopup: {
        isVisible: false,
        orderPublicId: null,
        orderId: null,
    },
    markAsDocumentsRequestedPopup: {
        isVisible: false,
        orderPublicId: null,
        orderId: null,
    },
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrder: state => {
            state.order = null;
        },
        setOrderData: (state, action: PayloadAction<Load>) => {
            state.order = action.payload;
        },
        setPickupInformationDrawerProps: (state, action: PayloadAction<OrderPickupInformationDrawerState>) => {
            state.pickupInformationDrawer = { ...state.pickupInformationDrawer, ...action.payload };
        },
        setDeliveryInformationDrawerProps: (state, action: PayloadAction<OrderDeliveryInformationDrawerState>) => {
            state.deliveryInformationDrawer = { ...state.deliveryInformationDrawer, ...action.payload };
        },
        setCustomerInformationDrawerProps: (state, action: PayloadAction<OrderCustomerInformationDrawerState>) => {
            state.customerInformationDrawer = { ...state.customerInformationDrawer, ...action.payload };
        },
        setPaymentInformationDrawerProps: (state, action: PayloadAction<OrderPaymentInformationDrawerState>) => {
            state.paymentInformationDrawer = { ...state.paymentInformationDrawer, ...action.payload };
        },
        setOrderVehicleDrawerProps: (state, action: PayloadAction<OrderVehicleDrawerState>) => {
            state.orderVehicleDrawer = { ...state.paymentInformationDrawer, ...action.payload };
        },
        setOrderCommodityDrawerProps: (state, action: PayloadAction<OrderCommodityDrawerState>) => {
            state.orderCommodityDrawer = { ...state.orderCommodityDrawer, ...action.payload };
        },
        setDriverInstructionsDrawerProps: (state, action: PayloadAction<OrderDriverInstructionsDrawerState>) => {
            state.driverInstructionsDrawer = { ...state.driverInstructionsDrawer, ...action.payload };
        },
        setDriverDrawerProps: (state, action: PayloadAction<OrderSetDriverDrawerState>) => {
            state.driverDrawer = { ...state.driverDrawer, ...action.payload };
        },
        setDispatcherDrawerProps: (state, action: PayloadAction<OrderSetDispatcherDrawerState>) => {
            state.dispatcherDrawer = { ...state.dispatcherDrawer, ...action.payload };
        },
        setMarkAsPaidDrawerProps: (state, action: PayloadAction<OrderMarkAsPaidDrawerState>) => {
            state.markAsPaidDrawer = action.payload;
        },
        setSendBOLDrawerProps: (state, action: PayloadAction<OrderSendBOLDrawerState>) => {
            state.sendBOLDrawer = { ...initialState.sendBOLDrawer, ...action.payload };
        },
        setSendInvoiceDrawerProps: (state, action: PayloadAction<OrderSendInvoiceDrawerState>) => {
            state.sendInvoiceDrawer = action.payload;
        },
        setOrderDetailsDrawerProps: (state, action: PayloadAction<OrderDetailsDrawerState>) => {
            state.orderDetailsDrawer = action.payload;
        },
        setOrderExpenseDrawerProps: (state, action: PayloadAction<OrderExpenseDrawerState>) => {
            state.orderExpenseDrawer = action.payload;
        },
        setOrderSendOfferToCarrierDrawerProps: (state, action: PayloadAction<OrderSendOfferToCarrierDrawerState>) => {
            state.sendOfferToCarrierDrawer = action.payload;
        },
        setOrderChatDrawerProps: (state, action: PayloadAction<OrderChatDrawerState>) => {
            state.orderChatDrawer = action.payload;
        },
        setOrderActivityDetailsDrawerProps: (state, action: PayloadAction<OrderActivityDetailsDrawerState>) => {
            state.orderActivityDetailsDrawer = action.payload;
        },
        setDriverPaymentFormDrawerProps: (state, action: PayloadAction<OrderDriverPaymentFormDrawerDrawerState>) => {
            state.driverPaymentFormDrawer = action.payload;
        },
        setUnassignDriverPopupProps: (state, action: PayloadAction<UnasignDriverPopupState>) => {
            state.unasignDriverPopup = action.payload;
        },
        setMarkAsNewPopupProps: (state, action: PayloadAction<MarkAsNewPopupState>) => {
            state.markAsNewPopup = action.payload;
        },
        setMarkAsPickedUpPopupProps: (state, action: PayloadAction<MarkAsPickedUpPopupState>) => {
            state.markAsPickedUpPopup = action.payload;
        },
        setMarkAsDeliveredPopupProps: (state, action: PayloadAction<MarkAsDeliveredPopupState>) => {
            state.markAsDeliveredPopup = action.payload;
        },
        setDeleteOrderPopupProps: (state, action: PayloadAction<DeleteOrderPopupState>) => {
            state.deleteOrderPopupState = action.payload;
        },
        setDeleteOrderVehiclePopupProps: (state, action: PayloadAction<DeleteOrderVehiclePopupState>) => {
            state.deleteOrderVehiclePopup = action.payload;
        },
        setDeleteOrderCommodityPopupProps: (state, action: PayloadAction<DeleteOrderCommodityPopupState>) => {
            state.deleteOrderCommodityPopup = action.payload;
        },
        setRestoreOrderPopupProps: (state, action: PayloadAction<RestoreOrderPopupState>) => {
            state.restoreOrderPopup = action.payload;
        },
        setDeleteOrderAttachmentPopupProps: (state, action: PayloadAction<DeleteOrderAttachmentPopupState>) => {
            state.deleteOrderAttachmentPopup = action.payload;
        },
        addOrderAttachmentIdToDelete: (state, action: PayloadAction<string>) => {
            if (state.editOrderAttachmentsIdsToDelete) {
                state.editOrderAttachmentsIdsToDelete.push(action.payload);
            } else {
                state.editOrderAttachmentsIdsToDelete = [action.payload];
            }
        },
        setDeleteInternalNoteModalProps: (state, action: PayloadAction<DeleteInternalNotePopupState>) => {
            state.deleteInternalNotePopup = action.payload;
        },
        setCreateEditInternalNoteModalProps: (state, action: PayloadAction<CreateEditInternalNotePopupState>) => {
            state.createEditInternalNotePopup = action.payload;
        },
        setDeleteExpensePopupProps: (state, action: PayloadAction<DeleteOrderExpensePopupState>) => {
            state.deleteOrderExpensePopup = action.payload;
        },
        setIsCreateOrderFromFileLoading: (state, action: PayloadAction<boolean>) => {
            state.isCreateOrderFromFileLoading = action.payload;
        },
        setRecalculateOrderTransactionsPopupProps: (state, action: PayloadAction<RecalculateOrderTransactionsPopupState>) => {
            state.recalculateOrderTransactionsPopup = action.payload;
        },
        setMarkAsDocumentsRequestedPopupProps: (state, action: PayloadAction<MarkAsDocumentsRequestedPopupState>) => {
            state.markAsDocumentsRequestedPopup = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(ordersApi.endpoints.createOrder.matchFulfilled, (state, { payload }) => {
            state.order = payload;
        });
        builder.addMatcher(ordersApi.endpoints.getOrder.matchFulfilled, (state, { payload }) => {
            state.order = payload;
        });
        builder.addMatcher(ordersApi.endpoints.updateOrder.matchFulfilled, (state, { payload }) => {
            state.order = payload;
        });
        builder.addMatcher(ordersApi.endpoints.updateDriver.matchFulfilled, (state, { payload }) => {
            state.order = payload as unknown as Load;
        });
    },
});

export const ordersActions = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
