import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { OrderStatisticsStatus } from '@enums';
import { StatisticsCounters } from '@store/api/orders-api';
import { FormOrdersFilters } from '@types';

export type OrdersFiltersFormState = Partial<{
    searchSubject: string;
    search: string;
    dispatchers: string[];
    driverAccountId: string[];
    sortBy: SortSelectValue;
}>;

export type OrdersFiltersProps = {
    initialFilters: FormOrdersFilters;
    initialStatusFilter?: OrderStatisticsStatus;
    onFiltersChange: (values: FormOrdersFilters) => void;
    onTabFilterClick: (value: OrderStatisticsStatus) => void;
    hideTabs?: boolean;
    statisticsCounters?: StatisticsCounters;
};
