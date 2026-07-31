import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { TabItemBase } from '@/components/common/tabs/tabs';
import { OffersFiltersParams, OffersStatistic } from '@store/api/order-offers';

export type OffersFiltersTypes = {
    searchSubject?: string;
    search?: string;
    carrierCompanyId?: string;
    shipperCompanyId?: string;
    sortBy: SortSelectValue;
};

export type OffersFiltersProps = {
    offersStats: OffersStatistic & { all: number };
    onSelectTab: (tab: TabItemBase) => void;
    onChangeFormValue: (values: OffersFiltersTypes) => void;
    filters: OffersFiltersParams;
};
