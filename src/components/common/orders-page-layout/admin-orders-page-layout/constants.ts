import { OrderSortingDirection, OrderSortingName } from '@enums';
import { GetOrdersData } from '@store/api/orders-api';

export const DEFAULT_PARAMS: GetOrdersData = {
    page: 1,
    perPage: 50,
    orderName: OrderSortingName.PICKUP_LOCATION,
    orderDirection: OrderSortingDirection.ASC,
};
