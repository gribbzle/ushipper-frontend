import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FeeCategoryType } from '@/enums/fee/fee-category-types-enum';
import {SelectField} from '@/fields/select-field';
import { useGetFeeCategoriesQuery } from '@store/api/fee-categories-api';

export const FeeRecurringCategorySelect = ({ ...props }: FieldRenderProps<string>) => {
    const { data: feeCategories } = useGetFeeCategoriesQuery();

    const options = useMemo(
        () =>
            feeCategories
                ?.filter(feeCategory => [FeeCategoryType.RECURRING, FeeCategoryType.ORDER_INTERVAL_RECURRING].includes(feeCategory.type))
                .map(feeCategory => ({
                    label: feeCategory.name,
                    value: feeCategory.id,
                })),
        [feeCategories],
    );

    return <SelectField {...props} options={options} />;
};
