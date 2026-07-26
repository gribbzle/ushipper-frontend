import { CatalogFiltersValue } from '@/components/client/catalogs/catalog-filters-tabs/catalog-filters-tabs.types';
import { CarriersCatalogListTabsEnum, DispatcherCatalogListTabsEnum, SidebarCountsEnum } from '@/enums';
import { Company } from '@store/admin';
import { AuthorizedUserInfo } from '@store/global/types';

export type BaseCatalogFiltersParams = {
    page?: number;
    perPage?: number;
    hasJobOffers?: boolean;
    hasFlags?: boolean;
    hasAcceptedJobOffers?: boolean;
    type?: string;
    [key: string]: any;
};

export type DispatcherCatalogInfo = Omit<
    AuthorizedUserInfo,
    | 'accountPublicId'
    | 'role'
    | 'roleId'
    | 'roleGroup'
    | 'companyName'
    | 'roleName'
    | 'roleType'
    | 'unreadChatMessagesCount'
    | 'countOfUnreadNotifications'
    | SidebarCountsEnum.countOfNewRequests
    | SidebarCountsEnum.countOfNewOffers
    | SidebarCountsEnum.countOfNewOrders
> & {
    isFlagged: boolean;
    rating: number | null;
    reviewsTotal: number;
    company: {
        publicId: string;
    };
};

export type CarriersCatalogInfo = Pick<
    Company,
    | 'publicId'
    | 'createdAt'
    | 'name'
    | 'nickname'
    | 'type'
    | 'email'
    | 'phone'
    | 'owner'
    | 'status'
    | 'usersCount'
    | 'usdotNumber'
    | 'rating'
    | 'reviewsTotal'
    | 'address'
    | 'state'
    | 'city'
    | 'logo'
    | 'specializations'
    | 'businessHours'
> & {
    id: number;
    activeUserCount: number;
    updatedAt: string;
    isFlagged: boolean;
};

export type DispatcherCatalogStatistic = {
    [key in DispatcherCatalogListTabsEnum]: number;
};

export type CarriersCatalogStatistic = {
    [key in CarriersCatalogListTabsEnum]: number;
};

export type DispatcherCatalogStatisticsCounters = {
    counters: DispatcherCatalogStatistic;
};

export type CarriersCatalogStatisticsCounters = {
    counters: CarriersCatalogStatistic;
};

export type CatalogStatistic = DispatcherCatalogStatistic | CarriersCatalogStatistic;

export type CatalogsSliceState = {
    selectedFilters: CatalogFiltersValue;
    isAllFiltersReset: boolean;
};
