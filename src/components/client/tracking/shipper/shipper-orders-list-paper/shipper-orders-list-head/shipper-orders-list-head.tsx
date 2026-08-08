import React, { useCallback, useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@hooks';
import { ShipperTrackingFiltersFormState } from '@store/client';
import { SegmentedControl } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './shipper-orders-list-head.scss';

const t = translateByNamespace('client:tracking-page:shipper-orders-list-paper');
const cn = classname('shipper-orders-list-head');

const segments = [
    { value: 'status', label: t('status') },
    { value: 'dispatcher', label: t('manager') },
];

export const ShippersOrdersListHead = ({ counter }: { counter?: number }) => {
    const { filters } = useQueryFilters<ShipperTrackingFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<ShipperTrackingFiltersFormState>({ resetPageOnChange: false });

    const handleToggleOrdersFilter = useCallback(
        (value: string | number) => {
            if (value === 'status' || value === 'dispatcher') {
                const { perPage: _perPage, page: _page, ...others } = filters;

                handleFiltersChange({ ...others, grouping: value }, true);
            }
        },
        [handleFiltersChange, filters],
    );

    const defaultSelected = useMemo(() => {
        if (!filters?.grouping) {
            return 0;
        }

        const selectedSegmentIndex = segments.findIndex(segment => segment.value === filters.grouping);

        return selectedSegmentIndex === -1 ? 0 : selectedSegmentIndex;
    }, [filters?.grouping]);

    return (
        <div className={cn('')}>
            <div className={cn('title-and-count')}>
                {t('title')} {!!counter && <span className={cn('count')}>{counter}</span>}
            </div>
            <SegmentedControl
                name='orders-list-filter'
                segments={segments}
                callback={handleToggleOrdersFilter}
                autoWidth={true}
                defaultIndex={defaultSelected}
            />
        </div>
    );
};
