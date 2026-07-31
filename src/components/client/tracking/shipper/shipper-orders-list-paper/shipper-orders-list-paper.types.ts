import { TrackingOrdersByDispatcherData, TrackingOrdersByStatusData } from '@store/api/tracking-api';

export type ShippersOrdersListPaperProps = {
    totalCounter?: number;
    groupedOrders?: (TrackingOrdersByStatusData | TrackingOrdersByDispatcherData)[];
};
