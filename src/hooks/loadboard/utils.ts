import { toSnakeCase } from 'js-convert-case';

import { CoordinatesWithRangeRegion, LoadBoardFilters, SavedLoadBoardFilters } from '@store/api/loadboard-api';

const convertPricePerKm = (price: number): number => price / 1.6;

const processLocations = (locations?: CoordinatesWithRangeRegion[]) => {
    return locations
        ?.filter(v => (v.longitude && v.latitude) || v.region || v.state)
        .map(location => {
            if (location.region) {
                return location.region === location.region.toUpperCase() ? location.region : toSnakeCase(location.region);
            }

            if (location.state) {
                return location.state;
            }

            return [location.latitude, location.longitude, location.distance];
        })
        .map(v => (Array.isArray(v) ? v.join(',') : v));
};

export const convertFiltersToRequestFilters = (filters: SavedLoadBoardFilters, searchRoute?: boolean): LoadBoardFilters => {
    const locationFilter: Partial<LoadBoardFilters> = {};

    if (searchRoute) {
        locationFilter.pathStartLocation = filters.pathStartLocation?.latitude
            ? `${filters.pathStartLocation.latitude},${filters.pathStartLocation.longitude}`
            : undefined;
        locationFilter.pathEndLocation = filters.pathEndLocation?.latitude
            ? `${filters.pathEndLocation.latitude},${filters.pathEndLocation.longitude}`
            : undefined;
        locationFilter.pathWaypoints = filters.pathWaypoints?.filter(v => v.latitude && v.longitude).map(v => `${v.latitude},${v.longitude}`);
        locationFilter.distanceOffPath =
            locationFilter.pathWaypoints?.length || locationFilter.pathEndLocation || locationFilter.pathStartLocation ? filters.distanceOffPath : undefined;
    } else {
        locationFilter.origins = processLocations(filters.origins);
        locationFilter.destinations = processLocations(filters.destinations);
    }

    return {
        ...locationFilter,
        vehicleTypes: filters.vehicleTypes,
        vehiclesMinCount: filters.vehiclesMinCount,
        vehiclesMaxCount: filters.vehiclesMaxCount,
        vehicleInop: filters.vehicleInop,
        shippingReadyBefore: Number.isInteger(filters.shippingReadyBefore) ? filters.shippingReadyBefore : undefined,
        sortNames: filters.sortNames,
        sortDirections: filters.sortDirections,
        paymentTerms: filters.paymentTerms,
        sources: filters.sources,
        customerName: filters.customerName,
        orderId: filters.orderId,
        minTotalPrice: filters.minTotalPrice,
        minPricePerKm: filters.minPricePerKm && convertPricePerKm(filters.minPricePerKm),
        trailerTypes: filters.trailerTypes,
        newPostedOnTopAfter: Number.isInteger(filters.newPostedOnTopAfter) && filters.newPostedOnTop ? filters.newPostedOnTopAfter : undefined,
        includeCompanyBlacklist: filters.includeCompanyBlacklist ? undefined : true,
        includeGlobalBlacklist: filters.includeGlobalBlacklist ? undefined : true,
    };
};

export const isSearchRouteFilters = (filters: SavedLoadBoardFilters): boolean =>
    !!(filters.pathWaypoints || filters.pathStartLocation || filters.pathEndLocation || filters.distanceOffPath);
