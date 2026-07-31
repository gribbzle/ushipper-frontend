import { toKebabCase } from 'js-convert-case';

import { Filters, LoadboardFiltersForUrlParams, LoadboardFiltersFromUrlParams } from '@/components/client/loadboard/loadboard-filters/types';
import { RADS } from '@/components/common/radius-select/radius-select';
import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { SelectOption } from '@/shared';
import { LoadboardTab, OrderSortingDirection, OrderSourcesEnum, TermsEnum, TransportTypeEnum, VehicleType } from '@enums';
import { CoordinatesWithName, SavedLoadBoardFilters } from '@store/api/loadboard-api';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { translateOrderSource } from '@utils/translate/order/translate-order-source';

const tVehicleTypes = translateByNamespace('common:vehicle-types');
const tPaymentTerms = translateByNamespace('common:payment-terms');
const tTransportTypes = translateByNamespace('common:transport-types');

export const removeExtLocationFields = (filters: SavedLoadBoardFilters, searchRoute: boolean): SavedLoadBoardFilters => {
    const newFilters = { ...filters };

    if (searchRoute) {
        if (Array.isArray(newFilters.pathWaypoints)) {
            newFilters.pathWaypoints = newFilters.pathWaypoints.filter(origin => origin?.latitude && origin?.longitude);
        } else {
            delete newFilters.pathWaypoints;
        }
    } else {
        if (Array.isArray(newFilters.origins)) {
            newFilters.origins = newFilters.origins.filter(origin => (origin?.latitude && origin?.longitude) || origin?.region || origin?.state);
        } else {
            delete newFilters.origins;
        }

        if (Array.isArray(newFilters.destinations)) {
            newFilters.destinations = newFilters.destinations.filter(
                destination => (destination?.latitude && destination?.longitude) || destination?.region || destination?.state,
            );
        } else {
            delete newFilters.destinations;
        }
    }

    return newFilters;
};

export const updateLocationFields = (filters: SavedLoadBoardFilters, searchRoute: boolean): SavedLoadBoardFilters => {
    const newFilters = { ...filters };

    if (searchRoute) {
        if (newFilters.origins && newFilters.origins.length > 0) {
            const { distance, region, state, ...pathStartLocation } = newFilters.origins[0];

            if (!region && !state) {
                newFilters.pathStartLocation = pathStartLocation;
                newFilters.distanceOffPath = distance;
            }
        }
        if (newFilters.destinations && newFilters.destinations.length > 0) {
            const { distance, region, state, ...pathEndLocation } = newFilters.destinations[0];

            if (!region && !state) {
                newFilters.pathEndLocation = pathEndLocation;
            }
        }
    } else {
        if (newFilters.pathStartLocation) {
            newFilters.origins = [{ ...newFilters.pathStartLocation, distance: newFilters.distanceOffPath ?? RADS[1] }];
        }
        if (newFilters.pathEndLocation) {
            newFilters.destinations = [{ ...newFilters.pathEndLocation, distance: newFilters.distanceOffPath ?? RADS[1] }];
        }
    }

    return newFilters;
};

export const convertToExternalFilters = (filters: Partial<Filters>, searchRoute: boolean): SavedLoadBoardFilters => {
    let newFilters = { ...filters } as SavedLoadBoardFilters;

    newFilters = removeExtLocationFields(newFilters, searchRoute);

    newFilters.vehicleTypes = filters.vehicleTypes?.map(v => v.value);
    newFilters.trailerTypes = filters.trailerTypes?.map(v => v.value);
    newFilters.paymentTerms = filters.paymentTerms?.map(v => v.value);
    newFilters.sources = filters.sources?.map(v => v.value);

    newFilters.sortNames = [filters.primarySort?.[0]?.value, filters.secondarySort?.[0]?.value].filter(Boolean) as string[];
    newFilters.sortDirections = [filters.primarySort?.[1]?.value, filters.secondarySort?.[1]?.value].filter(Boolean) as OrderSortingDirection.ASC[];

    delete (newFilters as Filters).primarySort;
    delete (newFilters as Filters).secondarySort;

    return newFilters;
};

export const convertToInnerFilters = (filters: SavedLoadBoardFilters): Filters => {
    const newFilters: Filters = { ...filters } as Filters;

    newFilters.vehicleTypes = filters.vehicleTypes?.map(
        v =>
            ({
                value: v,
                label: tVehicleTypes(toKebabCase(v)),
            } as SelectOption<VehicleType>),
    );

    newFilters.trailerTypes = filters.trailerTypes?.map(
        v =>
            ({
                value: v,
                label: tTransportTypes(toKebabCase(v)),
            } as SelectOption<TransportTypeEnum>),
    );

    newFilters.paymentTerms = filters.paymentTerms?.map(
        v =>
            ({
                value: v,
                label: tPaymentTerms(toKebabCase(v)),
            } as SelectOption<TermsEnum>),
    );

    newFilters.sources = filters.sources?.map(
        v =>
            ({
                value: v,
                label: translateOrderSource(v),
            } as SelectOption<OrderSourcesEnum>),
    );

    newFilters.primarySort =
        filters.sortNames?.[0] && filters.sortDirections?.[0]
            ? ([
                  {
                      value: filters.sortNames[0],
                      group: 'orderName',
                  },
                  {
                      value: filters.sortDirections[0],
                      group: 'orderDirection',
                  },
              ] as SortSelectValue)
            : undefined;

    newFilters.secondarySort =
        filters.sortNames?.[1] && filters.sortDirections?.[1]
            ? ([
                  {
                      value: filters.sortNames[1],
                      group: 'orderName',
                  },
                  {
                      value: filters.sortDirections[1],
                      group: 'orderDirection',
                  },
              ] as SortSelectValue)
            : undefined;

    delete (newFilters as SavedLoadBoardFilters).sortDirections;
    delete (newFilters as SavedLoadBoardFilters).sortNames;

    return newFilters;
};

const serializeObject = (obj?: Record<string, any>): string | undefined => {
    if (!obj) return undefined;

    return Object.entries(obj)
        .map(([key, value]) => `${key}:${value}`)
        .join('_');
};

const serializeArray = (array?: any[]): string[] | undefined => {
    if (!array) return undefined;

    return array.map(item => (typeof item === 'object' ? serializeObject(item) : item));
};

export const getLoadboardFiltersForUrlParams = (
    filters: SavedLoadBoardFilters & { page?: number; tab?: LoadboardTab },
    isSearchRoute?: boolean,
): LoadboardFiltersForUrlParams => {
    const {
        origins,
        destinations,
        pathStartLocation,
        pathEndLocation,
        pathWaypoints,
        vehicleInop,
        shippingReadyBefore,
        includeCompanyBlacklist,
        includeGlobalBlacklist,
        distanceOffPath,
        ...rest
    } = filters;

    const filterValues: LoadboardFiltersForUrlParams = {
        ...(isSearchRoute
            ? {
                  pathStartLocation: serializeObject(pathStartLocation),
                  pathEndLocation: serializeObject(pathEndLocation),
                  pathWaypoints: serializeArray(pathWaypoints),
                  distanceOffPath,
              }
            : {
                  origins: serializeArray(origins),
                  destinations: serializeArray(destinations),
              }),
        vehicleInop: vehicleInop !== undefined ? vehicleInop.toString() : undefined,
        shippingReadyBefore: shippingReadyBefore !== undefined ? shippingReadyBefore.toString() : undefined,
        includeCompanyBlacklist: includeCompanyBlacklist?.toString(),
        includeGlobalBlacklist: includeGlobalBlacklist?.toString(),
        ...rest,
    };

    return getObjectWithoutEmptyFields(filterValues);
};

const parseStringToObject = <T extends Record<string, any>>(str?: string): T | undefined => {
    if (!str) return;

    return Object.fromEntries(
        str.match(/[^_]+:[^_]+(?=_|$)/g)?.map(pair => {
            const [key, ...rest] = pair.split(':');
            const val = rest.join(':');
            let decodedValue: any = decodeURIComponent(val);

            if (!isNaN(decodedValue) && decodedValue.trim() !== '') {
                decodedValue = Number(decodedValue);
            }

            return [key, decodedValue];
        }) || [],
    ) as T;
};

const parseArray = (value: string | string[] | undefined): any[] | undefined => {
    if (!value) {
        return;
    }

    const values = typeof value === 'string' ? [value] : value;

    return values.map(item => parseStringToObject(item));
};

const parseSimpleArray = (value: string | string[] | undefined): string[] | undefined => {
    if (!value) return undefined;

    return typeof value === 'string' ? value.split(',') : value;
};

export const getLoadboardFiltersFromUrlParams = (
    filtersFromUrl: LoadboardFiltersFromUrlParams,
): SavedLoadBoardFilters & { page?: number; tab?: LoadboardTab; map?: string; filters?: string } => {
    const {
        origins,
        destinations,
        pathStartLocation,
        pathEndLocation,
        pathWaypoints,
        distanceOffPath,
        vehicleTypes,
        trailerTypes,
        newPostedOnTop,
        sortNames,
        sortDirections,
        newPostedOnTopAfter,
        shippingReadyBefore,
        vehiclesMaxCount,
        vehicleInop,
        paymentTerms,
        vehiclesMinCount,
        sources,
        drawerParsedOrderId,
        includeCompanyBlacklist,
        includeGlobalBlacklist,
        ...rest
    } = filtersFromUrl;

    const filters = {
        origins: parseArray(origins),
        destinations: parseArray(destinations),
        pathStartLocation: parseStringToObject<CoordinatesWithName>(pathStartLocation),
        pathEndLocation: parseStringToObject<CoordinatesWithName>(pathEndLocation),
        pathWaypoints: parseArray(pathWaypoints),
        distanceOffPath: Number(distanceOffPath),
        vehicleTypes: parseSimpleArray(vehicleTypes) as VehicleType[],
        trailerTypes: parseSimpleArray(trailerTypes) as TransportTypeEnum[],
        vehiclesMinCount: Number(vehiclesMinCount),
        vehiclesMaxCount: Number(vehiclesMaxCount),
        paymentTerms: parseSimpleArray(paymentTerms) as TermsEnum[],
        sources: parseSimpleArray(sources) as OrderSourcesEnum[],
        newPostedOnTopAfter: Number(newPostedOnTopAfter),
        newPostedOnTop: typeof newPostedOnTop === 'string' ? newPostedOnTop === 'true' : undefined,
        sortNames: parseSimpleArray(sortNames),
        sortDirections: parseSimpleArray(sortDirections) as OrderSortingDirection[],
        ...rest,
    };

    return {
        ...getObjectWithoutEmptyFields(filters),
        ...(vehicleInop ? { vehicleInop: Number(vehicleInop) } : undefined),
        ...(shippingReadyBefore ? { shippingReadyBefore: Number(shippingReadyBefore) } : undefined),
        includeCompanyBlacklist: includeCompanyBlacklist === 'false' ? false : true,
        includeGlobalBlacklist: includeGlobalBlacklist === 'false' ? false : true,
    };
};
