import { FundsTransferCalculatedStatus } from '@/enums/funds-transfer-calculated-status';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OrderSortingName } from '@/enums/order-sorting-name';
import { GetOrdersData } from '@store/api/orders-api';

export const DRIVER_ACCOUNT_PENDING_ORDERS_FILTERS: GetOrdersData = {
    orderDirection: OrderSortingDirection.DESC,
    orderName: OrderSortingName.CREATION_DATE,
    searchSubject: 'order_id',
    fundsTransferCalculatedStatus: FundsTransferCalculatedStatus.PENDING,
    page: 1,
};

export const DEFAULT_COD_COP_ORDERS_PARAMS: GetOrdersData = {
    instantTermPaymentTypeSet: true,
    orderDirection: OrderSortingDirection.DESC,
    orderName: OrderSortingName.DELIVERY_DATE,
    searchSubject: 'order_id',
    perPage: 50,
};
