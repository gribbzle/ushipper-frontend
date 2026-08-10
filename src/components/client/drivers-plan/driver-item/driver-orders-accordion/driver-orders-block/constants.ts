import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OrderSortingName } from '@/enums/order-sorting-name';

export const BASE_ORDERS_FILTERS = {
    orderName: OrderSortingName.CREATION_DATE,
    orderDirection: OrderSortingDirection.DESC,
};
