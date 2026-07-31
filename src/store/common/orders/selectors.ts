type AppState = {
    common: {
        orders: any;
    };
};
import { DeleteOrderAttachmentPopupState, MarkAsDocumentsRequestedPopupState, OrderDriverPaymentFormDrawerDrawerState } from './types';

const ordersPageSelector = (state: AppState) => state.common.orders;

export const orderSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order;
};

export const orderPublicIdSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.publicId;
};

export const orderStatusSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.status;
};

export const orderSourceSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.source;
};

export const orderCreateAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.createdAt;
};

export const orderCreatorSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.creator;
};

export const orderAccountingSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.accounting;
};

export const orderDetailsSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.details;
};

export const orderPickupInformationSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.pickupInformation;
};

export const orderDeliveryInformationSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.deliveryInformation;
};

export const orderDeliveredAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.deliveredAt;
};

export const orderCustomerInformationSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.customerInformation;
};

export const orderPaymentInformationSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.paymentInformation;
};

export const orderFullPriceSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.fullPrice;
};

export const orderPriceSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.price;
};

export const orderDriverFeeChargeSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.driverFeeCharge;
};

export const orderFundsTransferStatusSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.fundsTransferStatus;
};

export const orderDriverDelayedPaymentSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.driverDelayedPayment;
};

export const orderDrivingDistanceSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.drivingDistance;
};

export const orderPaymentStatusSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.paymentStatus;
};

export const orderPaymentSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.payment;
};

export const orderDriverSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.driver;
};

export const orderDispatcherSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.dispatcher;
};

export const orderShipperOrderSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.shipperOrder;
};

export const orderCarrierOrderSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.carrierOrder;
};

export const orderPickedUpAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.pickedUpAt;
};

export const orderPaidAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.paidAt;
};

export const orderDeletedAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.deletedAt;
};

export const orderFundsTransferredAtSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.fundsTransferredAt;
};

export const orderVehiclesSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.vehicles;
};

export const orderCommoditiesSelector = (state: AppState) => {
    const { order } = ordersPageSelector(state);

    return order?.commodities;
};

export const orderCustomerInformationDrawerPropsSelector = (state: AppState) => {
    const { customerInformationDrawer } = ordersPageSelector(state);

    return customerInformationDrawer;
};

export const deleteOrderExpensePopupSelector = (state: AppState) => {
    const { deleteOrderExpensePopup } = ordersPageSelector(state);

    return deleteOrderExpensePopup;
};

export const orderSendOfferToCarrierPropsSelector = (state: AppState) => {
    const { sendOfferToCarrierDrawer } = ordersPageSelector(state);

    return sendOfferToCarrierDrawer;
};

export const orderExpenseDrawerPropsSelector = (state: AppState) => {
    const { orderExpenseDrawer } = ordersPageSelector(state);

    return orderExpenseDrawer;
};

export const orderPaymentInformationDrawerPropsSelector = (state: AppState) => {
    const { paymentInformationDrawer } = ordersPageSelector(state);

    return paymentInformationDrawer;
};

export const orderDeliveryInformationDrawerPropsSelector = (state: AppState) => {
    const { deliveryInformationDrawer } = ordersPageSelector(state);

    return deliveryInformationDrawer;
};

export const orderSetDriverDrawerPropsSelector = (state: AppState) => {
    const { driverDrawer } = ordersPageSelector(state);

    return driverDrawer;
};

export const orderOrderChatDrawerPropsSelector = (state: AppState) => {
    const { orderChatDrawer } = ordersPageSelector(state);

    return orderChatDrawer;
};

export const orderSetDriverInstructionsDrawerPropsSelector = (state: AppState) => {
    const { driverInstructionsDrawer } = ordersPageSelector(state);

    return driverInstructionsDrawer;
};

export const orderPickupInformationDrawerPropsSelector = (state: AppState) => {
    const { pickupInformationDrawer } = ordersPageSelector(state);

    return pickupInformationDrawer;
};

export const orderSetDispatcherDrawerPropsSelector = (state: AppState) => {
    const { dispatcherDrawer } = ordersPageSelector(state);

    return dispatcherDrawer;
};

export const orderMarkAsPaidDrawerPropsSelector = (state: AppState) => {
    const { markAsPaidDrawer } = ordersPageSelector(state);

    return markAsPaidDrawer;
};

export const orderSendBOLDrawerPropsSelector = (state: AppState) => {
    const { sendBOLDrawer } = ordersPageSelector(state);

    return sendBOLDrawer;
};

export const orderSendInvoiceDrawerPropsSelector = (state: AppState) => {
    const { sendInvoiceDrawer } = ordersPageSelector(state);

    return sendInvoiceDrawer;
};

export const orderDetailsDrawerPropsSelector = (state: AppState) => {
    const { orderDetailsDrawer } = ordersPageSelector(state);

    return orderDetailsDrawer;
};

export const orderActivityDetailsDrawerPropsSelector = (state: AppState) => {
    const { orderActivityDetailsDrawer } = ordersPageSelector(state);

    return orderActivityDetailsDrawer;
};

export const orderDriverPaymentFormDrawerPropsSelector = (state: AppState): OrderDriverPaymentFormDrawerDrawerState => {
    const { driverPaymentFormDrawer } = ordersPageSelector(state);

    return driverPaymentFormDrawer;
};

export const unassignDriverPopupSelector = (state: AppState) => {
    const { unasignDriverPopup } = ordersPageSelector(state);

    return unasignDriverPopup;
};

export const markAsNewPopupSelector = (state: AppState) => {
    const { markAsNewPopup } = ordersPageSelector(state);

    return markAsNewPopup;
};

export const markAsPickedUpPopupSelector = (state: AppState) => {
    const { markAsPickedUpPopup } = ordersPageSelector(state);

    return markAsPickedUpPopup;
};

export const markAsDeliveredPopupSelector = (state: AppState) => {
    const { markAsDeliveredPopup } = ordersPageSelector(state);

    return markAsDeliveredPopup;
};

export const deleteOrderPopupSelector = (state: AppState) => {
    const { deleteOrderPopupState } = ordersPageSelector(state);

    return deleteOrderPopupState;
};

export const restoreOrderPopupSelector = (state: AppState) => {
    const { restoreOrderPopup } = ordersPageSelector(state);

    return restoreOrderPopup;
};

export const deleteOrderAttachmentPopupSelector = (state: AppState): DeleteOrderAttachmentPopupState => {
    const { deleteOrderAttachmentPopup } = ordersPageSelector(state);

    return deleteOrderAttachmentPopup;
};

export const deleteInternalNotePopupPropsSelector = (state: AppState) => {
    const { deleteInternalNotePopup } = ordersPageSelector(state);

    return deleteInternalNotePopup;
};

export const createEditInternalNotePopupPropsSelector = (state: AppState) => {
    const { createEditInternalNotePopup } = ordersPageSelector(state);

    return createEditInternalNotePopup;
};

export const deleteOrderVehiclePopupSelector = (state: AppState) => {
    const { deleteOrderVehiclePopup } = ordersPageSelector(state);

    return deleteOrderVehiclePopup;
};

export const deleteOrderCommodityPopupSelector = (state: AppState) => {
    const { deleteOrderCommodityPopup } = ordersPageSelector(state);

    return deleteOrderCommodityPopup;
};

export const recalculateOrderTransactionsPopupSelector = (state: AppState) => {
    const { recalculateOrderTransactionsPopup } = ordersPageSelector(state);

    return recalculateOrderTransactionsPopup;
};

export const markAsDocumentsRequestedPopupSelector = (state: AppState): MarkAsDocumentsRequestedPopupState => {
    const { markAsDocumentsRequestedPopup } = ordersPageSelector(state);

    return markAsDocumentsRequestedPopup;
};

export const orderVehicleDrawerPropsSelector = (state: AppState) => {
    const { orderVehicleDrawer } = ordersPageSelector(state);

    return orderVehicleDrawer;
};

export const orderCommodityDrawerPropsSelector = (state: AppState) => {
    const { orderCommodityDrawer } = ordersPageSelector(state);

    return orderCommodityDrawer;
};

export const isCreateOrderFromFileLoadingSelector = (state: AppState) => {
    const { isCreateOrderFromFileLoading } = ordersPageSelector(state);

    return isCreateOrderFromFileLoading;
};
