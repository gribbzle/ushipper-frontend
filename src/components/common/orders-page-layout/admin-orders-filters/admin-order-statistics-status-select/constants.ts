import { OrderStatisticsStatus, OrderType } from '@enums';

export const ORDER_STATISTICS_STATUS_MAP: Record<OrderType, OrderStatisticsStatus[]> = {
    [OrderType.CARRIER]: [OrderStatisticsStatus.STATUS_NEW, OrderStatisticsStatus.PICKED_UP, OrderStatisticsStatus.DELIVERED, OrderStatisticsStatus.DELETED],
    [OrderType.SHIPPER]: [
        OrderStatisticsStatus.STATUS_NEW,
        OrderStatisticsStatus.ON_HOLD,
        OrderStatisticsStatus.POSTED,
        OrderStatisticsStatus.PENDING,
        OrderStatisticsStatus.ACCEPTED,
        OrderStatisticsStatus.PICKED_UP,
        OrderStatisticsStatus.DELIVERED,
        OrderStatisticsStatus.DECLINED,
        OrderStatisticsStatus.CANCELLED,
    ],
};
