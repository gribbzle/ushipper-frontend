import {
    FundsTransferCalculatedStatus,
    InstantTermPaymentType,
    OrderSortingDirection,
    OrderSortingName,
    OrderStatisticsGroup,
    OrderStatisticsStatus,
    OrderStatus,
} from '@enums';
import { GetOrdersData } from '@store/api/orders-api';

export type OrdersFiltersValue = Omit<GetOrdersData, 'perPage' | 'statisticsStatus'> & { requestsOrderId?: string; statisticsStatus?: OrderStatisticsStatus };

export type AdminOrdersFiltersValue = Omit<GetOrdersData, 'statisticsStatus'> & {
    statisticsStatus?: OrderStatisticsStatus[];
};

type BaseOrdersFilters<TStatisticsStatus = OrderStatisticsStatus | OrderStatisticsStatus[]> = Partial<{
    searchSubject: string;
    search: string;
    dispatchers?: string[];
    orderName: OrderSortingName;
    orderDirection: OrderSortingDirection;
    statisticsStatus: TStatisticsStatus;
    page: number;
    perPage: number;
    driverAccountId: string[];
}>;

export type OrdersFiltersFromUrlParams = BaseOrdersFilters<OrderStatisticsStatus> &
    Partial<{
        statisticsGroup: OrderStatisticsGroup;
        statuses: OrderStatus[];
        requestsOrderId: string;
    }>;

export type OrdersAminFiltersFromUrlParams = BaseOrdersFilters<OrderStatisticsStatus[]> &
    Partial<{
        companyPublicId: string;
        instantTermPaymentType: InstantTermPaymentType;
        fundsTransferStatus: string;
        fundsTransferCalculatedStatus: FundsTransferCalculatedStatus;
        createdAtFrom: string;
        createdAtTo: string;
    }>;

type BaseFormOrdersFilters<TStatisticsStatus = OrderStatisticsStatus | OrderStatisticsStatus[]> = Partial<{
    searchSubject: string;
    search: string;
    dispatchers?: string[];
    orderName: OrderSortingName;
    orderDirection: OrderSortingDirection;
    statisticsStatus: TStatisticsStatus;
    driverAccountId: string[];
}>;

export type FormOrdersFilters = BaseFormOrdersFilters<OrderStatisticsStatus>;

export type AdminFormOrdersFilters = BaseFormOrdersFilters<OrderStatisticsStatus[]> &
    Partial<{
        companyPublicId: string;
        fundsTransferStatus: string;
        instantTermPaymentType: InstantTermPaymentType;
        fundsTransferCalculatedStatus: FundsTransferCalculatedStatus;
        createdAtFrom: string;
        createdAtTo: string;
    }>;
