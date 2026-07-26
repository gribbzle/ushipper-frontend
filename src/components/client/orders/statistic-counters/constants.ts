import { OrderStatisticsGroup } from '@/enums';

export const ORDER_STATISTICS_GROUP_COLOR: Record<OrderStatisticsGroup, string> = {
    [OrderStatisticsGroup.AGING_ORDERS]: '#eb5757',
    [OrderStatisticsGroup.DELAYED_PICK_UPS]: '#bc7407',
    [OrderStatisticsGroup.DELAYED_DELIVERIES]: '#6ea2e7',
    [OrderStatisticsGroup.TO_PICK_UP_TODAY]: '#f2f9ec',
    [OrderStatisticsGroup.TO_DELIVER_TODAY]: '#b5b5c3',
};
