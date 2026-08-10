import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { TabItemBase } from '@/components/common/tabs/tabs';
import { JobOfferSortingName } from '@/enums/offer-sorting-name';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OffersStatistic } from '@store/api/order-offers';
import { JobOffer } from '@store/client';

export type JobOffersFiltersTypes = {
    searchSubjects?: string;
    search?: string;
    sortBy: SortSelectValue;
    type: JobOffer['type'];
};

export type JobOffersFiltersParams = {
    orderName?: JobOfferSortingName;
    orderDirection?: OrderSortingDirection;
    status?: OfferStatusesEnum;
    searchQuery?: string;
    searchSubjects?: string;
    type: JobOffer['type'];
};

export type JobOffersFiltersProps = {
    offersStats: OffersStatistic;
    onSelectTab: (tab: TabItemBase) => void;
    onChangeFormValue: (values: JobOffersFiltersTypes) => void;
    filters: JobOffersFiltersParams;
};

export type JobOfferStatisticsCounters = {
    statusCounters: OffersStatistic;
};
