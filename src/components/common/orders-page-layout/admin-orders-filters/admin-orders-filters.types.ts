import { SortSelectValue } from '@components';
import { FundsTransferCalculatedStatus, InstantTermPaymentType, OrderStatisticsStatus } from '@enums';
import { AdminFormOrdersFilters } from '@types';

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
