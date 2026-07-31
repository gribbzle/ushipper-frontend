import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { SavedLoadBoardFilters } from '@store/api/loadboard-api';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderSource } from '@utils/translate/order/translate-order-source';

const t = translateByNamespace('client:loadboard-filters');
const tVehicleTypes = translateByNamespace('common:vehicle-types');
const tTransportTypes = translateByNamespace('common:transport-types');
const tPaymentTerms = translateByNamespace('common:payment-terms');

export const getFilterValue = <T extends keyof SavedLoadBoardFilters>(
    prop: T,
    filters: SavedLoadBoardFilters,
    searchRoute?: boolean,
): React.ReactElement | string => {
    let filterValue = null;

    switch (prop) {
        case 'origins':
        case 'destinations':
            if (searchRoute) {
                return '';
            }

            filterValue = filters[prop] as SavedLoadBoardFilters['origins' | 'destinations'];

            if (!(filterValue && filterValue.length && (filterValue[0].latitude || filterValue[0].region || filterValue[0].state))) {
                return '';
            }

            return filterValue && filterValue.length && (filterValue[0].latitude || filterValue[0].region || filterValue[0].state)
                ? filterValue.length === 1
                    ? filterValue[0].name
                    : `${filterValue.length} ${t('selected')}`
                : '';
        case 'pathWaypoints':
            if (!searchRoute) {
                return '';
            }

            filterValue = filters[prop] as SavedLoadBoardFilters['pathWaypoints'];
            if (!(filterValue && filterValue.length && filterValue[0].latitude)) {
                return '';
            }

            return filterValue && filterValue.length && filterValue[0].latitude
                ? filterValue.length === 1
                    ? filterValue[0].name
                    : `${filterValue.length} ${t('selected')}`
                : '';
        case 'pathEndLocation':
        case 'pathStartLocation':
            if (!searchRoute) {
                return '';
            }

            filterValue = filters[prop] as SavedLoadBoardFilters['pathEndLocation' | 'pathStartLocation'];

            return filterValue && filterValue.latitude ? filterValue.name : '';

        case 'paymentTerms':
            filterValue = filters[prop] as SavedLoadBoardFilters['paymentTerms'];

            return filterValue && filterValue.length
                ? filterValue.length > 1
                    ? `${filterValue.length} ${t('selected')}`
                    : tPaymentTerms(toKebabCase(filterValue[0]))
                : '';
        case 'sources':
            filterValue = filters[prop] as SavedLoadBoardFilters['sources'];

            if (!filterValue || !filterValue.length) {
                return '';
            }

            if (filterValue.length > 1) {
                return `${filterValue.length} ${t('selected')}`;
            }

            return translateOrderSource(filterValue[0]);
        case 'vehicleInop':
            filterValue = filters[prop] as SavedLoadBoardFilters['vehicleInop'];

            return filterValue !== null && filterValue !== undefined ? (filterValue ? t('inoperable') : t('operable')) : '';
        case 'shippingReadyBefore':
            filterValue = filters[prop] as SavedLoadBoardFilters['shippingReadyBefore'];

            return filterValue !== null && filterValue !== undefined ? t('days', { count: filterValue }) : '';
        case 'vehicleTypes':
            filterValue = filters[prop] as SavedLoadBoardFilters['vehicleTypes'];

            return filterValue && filterValue.length
                ? filterValue.length > 1
                    ? `${filterValue.length} selected`
                    : tVehicleTypes(toKebabCase(filterValue[0]))
                : '';
        case 'trailerTypes':
            filterValue = filters[prop] as SavedLoadBoardFilters['trailerTypes'];

            return filterValue && filterValue.length
                ? filterValue.length > 1
                    ? `${filterValue.length} ${t('selected')}`
                    : tTransportTypes(toKebabCase(filterValue[0]))
                : '';
        case 'vehiclesMinCount':
            filterValue = filters[prop] as SavedLoadBoardFilters['vehiclesMinCount'];

            return filterValue && filterValue > 1 ? String(filterValue) : '';

        default:
            return filters[prop] ? `${filters[prop]}` : '';
    }
};
