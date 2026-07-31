import React, { useCallback, useMemo } from 'react';

import { Tag } from '@/components/common/info-tag/info-tag';
import { useLoadboard } from '@hooks';
import { XIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { isSearchAlongRouteSelector, loadboardListSelector } from '@store/client/loadboard/selectors';
import { loadboardActions } from '@store/client/loadboard/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { getFilterValue } from './utils';

import './loadboard-filters-current-search.scss';

const t = translateByNamespace('client:loadboard-filters');

const cn = classname('loadboard-filters-current-search');

const propsList = [
    'origins',
    'destinations',
    'pathStartLocation',
    'pathEndLocation',
    'pathWaypoints',
    'vehicleTypes',
    'trailerTypes',
    'vehicleInop',
    'vehiclesMinCount',
    'vehiclesMaxCount',
    'shippingReadyBefore',
    'paymentTerms',
    'minPricePerKm',
    'minTotalPrice',
    'sources',
    'customerName',
    'orderId',
] as const;

export const LoadboardFiltersCurrentSearch = () => {
    const { filters } = useAppSelector(loadboardListSelector);
    const searchRoute = useAppSelector(isSearchAlongRouteSelector);

    const dispatch = useAppDispatch();

    const { updateURLFilters } = useLoadboard();

    const filterNames = useMemo<Record<(typeof propsList)[number], string>>(() => {
        return {
            origins: t('origin'),
            destinations: t('destination'),
            pathStartLocation: t('origin'),
            pathEndLocation: t('destination'),
            pathWaypoints: t('waypoint'),
            vehicleTypes: t('vehicle-type'),
            trailerTypes: t('trailer-type'),
            vehicleInop: t('condition'),
            vehiclesMinCount: t('min-vehicles'),
            vehiclesMaxCount: t('max-vehicles'),
            shippingReadyBefore: t('ready-to-ship'),
            paymentTerms: t('payment-terms'),
            minPricePerKm: t('min-price-mile'),
            minTotalPrice: t('min-total-price'),
            sources: t('source-platform'),
            customerName: t('shipper'),
            orderId: t('order-id'),
        };
    }, []);

    const filtersHaveValue = useMemo(() => {
        return propsList.some(prop => getFilterValue(prop, filters, searchRoute));
    }, [filters, searchRoute]);

    const resetFilterValue = useCallback(
        (prop: (typeof propsList)[number]) => {
            const newFilters = { ...filters, [prop]: undefined, ['vehiclesMinCount']: 1 };

            dispatch(loadboardActions.setListFilters(newFilters));
            updateURLFilters(newFilters);
        },
        [dispatch, updateURLFilters, filters],
    );

    const resetFilters = useCallback(() => {
        const resetFilters = { ...filters };

        propsList.forEach(prop => {
            if (Object.hasOwn(resetFilters, prop)) {
                if (prop === 'vehiclesMinCount') {
                    resetFilters[prop] = 1;
                } else {
                    resetFilters[prop] = undefined;
                }
            }
        });

        dispatch(loadboardActions.setListFilters(resetFilters));
        updateURLFilters(resetFilters);
    }, [filters, updateURLFilters, dispatch]);

    const list = useMemo(
        () =>
            propsList.map((prop, index) => {
                const value = getFilterValue(prop, filters, searchRoute);

                return value ? (
                    <Tag className={cn('item')} key={index} withHover={true} elementTag='button' onClick={() => resetFilterValue(prop)}>
                        {filterNames[prop]}: {value}
                        <div className={cn('reset-icon')}>
                            <XIcon />
                        </div>
                    </Tag>
                ) : null;
            }),
        [searchRoute, filterNames, filters, resetFilterValue],
    );

    return (
        <div className={cn()}>
            {filtersHaveValue && (
                <>
                    <div className={cn('title')}>{t('current-search')}:</div>
                    {list}
                    <Tag onClick={resetFilters} className={cn('item')} type='primary' elementTag='button' withHover={true}>
                        {t('clear-all')}
                    </Tag>
                </>
            )}
        </div>
    );
};
