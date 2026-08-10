import { FundsTransferCalculatedStatus } from '@/enums/funds-transfer-calculated-status';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OrderSortingName } from '@/enums/order-sorting-name';
import { OrderStatisticsGroup } from '@/enums/order/order-statistics-group';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { OrderStatus } from '@/enums/order-status';
import { OrderType } from '@/enums/order/order-type';

export type OrderFilters = Partial<{
    searchSubject: string;
    search: string;
    dispatchers: string[];
    driverAccountId: string[];
    ownerAccountId: string;
}>;

export type FundsTransferCalculatedStatusesType = 'pending' | 'not_paid' | 'pending_documents' | 'damage_claim' | 'paid';

export type GetOrdersData = OrderFilters &
    Partial<{
        page: number;
        perPage: number;
        orderName: OrderSortingName;
        orderDirection: OrderSortingDirection;
        statisticsGroup: OrderStatisticsGroup;
        statisticsStatus: OrderStatisticsStatus | OrderStatisticsStatus[];
        hasOrderRequests: number;
        companyPublicId: string;
        type: OrderType;
        fundsTransferStatus: string;
        createdAtFrom: string;
        createdAtTo: string;
        fundsTransferCalculatedStatus: FundsTransferCalculatedStatus;
        drivers: string[];
        instantTermPaymentType: InstantTermPaymentType;
        instantTermPaymentTypeSet: boolean;
        statuses: OrderStatus[];
    }>;

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
