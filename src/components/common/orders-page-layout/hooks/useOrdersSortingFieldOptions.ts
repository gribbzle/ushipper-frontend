import { useMemo } from 'react';

import { OrderSortingDirection, OrderSortingName } from '@/enums';
import { translateSortingOption } from '@/utils/translations';
import { SortSelectOptions } from '@components';

export const useOrdersSortingFieldOptions = () => {
    return useMemo<SortSelectOptions>(
        () => [
            {
                options: Object.values(OrderSortingName).map(orderName => ({
                    group: 'orderName',
                    label: translateSortingOption(orderName),
                    value: orderName,
                })),
            },
            {
                options: [
                    {
                        group: 'orderDirection',
                        label: translateSortingOption('asc'),
                        labelForInput: '(A to Z)',
                        value: OrderSortingDirection.ASC,
                    },
                    {
                        group: 'orderDirection',
                        label: translateSortingOption('desc'),
                        labelForInput: '(Z to A)',
                        value: OrderSortingDirection.DESC,
                    },
                ],
            },
        ],
        [],
    );
};
