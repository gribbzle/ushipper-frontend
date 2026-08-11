import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { FundsTransferCalculatedStatus } from '@/enums/funds-transfer-calculated-status';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { AdminFormOrdersFilters } from '@/types/order';

export type AdminOrdersFiltersFormState = Partial<{
    searchSubject: string;
    search: string;
    dispatchers: string[];
    sortBy: SortSelectValue;
    companyPublicId: string;
    statisticsStatus: OrderStatisticsStatus[];
    fundsTransferStatus: string;
    instantTermPaymentType: InstantTermPaymentType;
    fundsTransferCalculatedStatus: FundsTransferCalculatedStatus;
    createdAtFrom: string;
    createdAtTo: string;
    driverAccountId: string[];
}>;

export type AdminOrdersFiltersProps = {
    initialFilters: AdminFormOrdersFilters;
    onFiltersChange: (values: AdminFormOrdersFilters) => void;
};
