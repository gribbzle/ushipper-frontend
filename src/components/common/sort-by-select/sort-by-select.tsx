import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SortSelectOptions, SortSelectValue } from '@/components/common/sort-select/sort-select';
import { CatalogSortingNameEnum } from '@/enums/catalog-sorting-name-enum';
import { JobOfferSortingName, OfferSortingName } from '@/enums/offer-sorting-name';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { OrderSortingName } from '@/enums/order-sorting-name';
import { translateSortingOption } from '@/utils/translations';
import {SortSelectInput} from '@/fields/sort-select-input';

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
