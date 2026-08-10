import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OrderSortingName } from '@/enums/order-sorting-name';
import { GetOrdersData } from '@store/api/orders-api';

export const DEFAULT_PARAMS: GetOrdersData = {
    page: 1,
    perPage: 50,
    orderName: OrderSortingName.PICKUP_LOCATION,
    orderDirection: OrderSortingDirection.ASC,
};
