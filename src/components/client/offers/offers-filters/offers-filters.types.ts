import { SortSelectValue, TabItemBase } from '@components';
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
