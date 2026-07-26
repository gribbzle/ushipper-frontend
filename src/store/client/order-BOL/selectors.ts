import { AppState } from '@store';

export const OrderBOLSelector = (state: AppState) => state.client.orderBOL.data;

export const orderBOLOrderSelector = (state: AppState) => OrderBOLSelector(state)?.order;

export const orderBOLOrderPublicIdSelector = (state: AppState) => OrderBOLSelector(state)?.order.publicId;

export const orderBOLOrderDetailsSelector = (state: AppState) => OrderBOLSelector(state)?.order.details;

export const orderBOLOrderStatusSelector = (state: AppState) => OrderBOLSelector(state)?.order.status;

export const orderBOLOrderPickupInformationSelector = (state: AppState) => OrderBOLSelector(state)?.order.pickupInformation;

export const orderBOLOrderDeliveryInformationSelector = (state: AppState) => OrderBOLSelector(state)?.order.deliveryInformation;

export const orderBOLOrderVehiclesSelector = (state: AppState) => OrderBOLSelector(state)?.order.vehicles;

export const orderBOLOrderCommoditiesSelector = (state: AppState) => OrderBOLSelector(state)?.order.commodities;

export const orderBOLCreatedAtSelector = (state: AppState) => OrderBOLSelector(state)?.createdAt;
