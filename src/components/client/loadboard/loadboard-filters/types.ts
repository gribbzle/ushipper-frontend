import { LocationFilterValue } from '@/components/client/loadboard/loadboard-filter-location/loadboard-filter-location';
import { WaypointsValue } from '@/components/client/loadboard/loadborad-filter-waypoints/loadboard-filter-waypoints';
import { SelectOption } from '@/shared';
import { SortSelectValue } from '@components';
import { LoadboardTab, OrderSortingDirection, OrderSourcesEnum, TermsEnum, TransportTypeEnum, VehicleType } from '@enums';

export interface Filters {
    vehicleTypes?: SelectOption<VehicleType>[];
    trailerTypes?: SelectOption<TransportTypeEnum>[];
    origins?: LocationFilterValue;
    pathStartLocation?: WaypointsValue;
    pathEndLocation?: WaypointsValue;
    destinations?: LocationFilterValue;
    pathWaypoints?: WaypointsValue[];
    condition?: number;
    vehiclesMinCount?: number;
    vehiclesMaxCount?: number;
    shippingReadyBefore?: number;
    paymentTerms?: SelectOption<TermsEnum>[];
    sources?: SelectOption<OrderSourcesEnum>[];
    customerName?: string;
    orderId?: string;
    minPricePerKm?: number;
    minTotalPrice?: number;
    newPostedOnTop?: boolean;
    newPostedOnTopAfter?: number;
    primarySort?: SortSelectValue;
    secondarySort?: SortSelectValue;
    searchAlongRoute?: 1 | 0;
    distanceOffPath?: number;
    includeCompanyBlacklist?: boolean;
    includeGlobalBlacklist?: boolean;
}

export type LoadboardFiltersForUrlParams = Partial<{
    vehicleTypes: VehicleType[];
    trailerTypes: TransportTypeEnum[];
    origins: string[];
    destinations: string[];
    pathStartLocation: string;
    pathEndLocation: string;
    pathWaypoints: string[];
    vehiclesMinCount: number;
    vehiclesMaxCount: number;
    shippingReadyBefore: string;
    paymentTerms: TermsEnum[];
    sources: OrderSourcesEnum[];
    customerName: string;
    orderId: string;
    minPricePerKm: number;
    minTotalPrice: number;
    newPostedOnTop: boolean;
    newPostedOnTopAfter: number;
    sortNames: string[];
    sortDirections: OrderSortingDirection[];
    searchAlongRoute: string;
    distanceOffPath: number;
    vehicleInop: string;
    page: number;
    tab: LoadboardTab;
    map: string;
    filters: string;
    includeCompanyBlacklist: string;
    includeGlobalBlacklist: string;
}>;

export type LoadboardFiltersFromUrlParams = LoadboardFiltersForUrlParams &
    Partial<{
        drawerParsedOrderId: string;
    }>;
