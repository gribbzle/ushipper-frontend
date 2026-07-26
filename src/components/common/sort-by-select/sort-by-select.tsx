import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CatalogSortingNameEnum, JobOfferSortingName, OfferSortingName, OrderSortingDirection, OrderSortingName } from '@/enums';
import { translateSortingOption } from '@/utils/translations';
import { SortSelectOptions, SortSelectValue } from '@components';
import { SortSelectInput } from '@fields';

type Props = {
    options: OrderSortingName | OfferSortingName | JobOfferSortingName | CatalogSortingNameEnum;
} & FieldRenderProps<SortSelectValue>;

export const SortBySelect = ({ options, ...rest }: Props) => {
    const { meta, input, closeMenuOnSelect } = rest;

    const choice = useMemo<SortSelectOptions>(
        () => [
            {
                options: Object.values(options).map(orderName => ({
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
        [options],
    );

    return <SortSelectInput input={input} meta={meta} choice={choice} closeMenuOnSelect={closeMenuOnSelect} />;
};
