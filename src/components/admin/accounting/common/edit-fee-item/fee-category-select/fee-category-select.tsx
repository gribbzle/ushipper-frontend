import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FeeCategoryType } from '@/enums';
import { SelectField } from '@fields';
import { useGetFeeCategoriesQuery } from '@store/api/fee-categories-api';

type FeeCategorySelectProps = FieldRenderProps<string> & { hideRecurringOption?: boolean };

export const FeeCategorySelect = ({ hideRecurringOption = false, ...props }: FeeCategorySelectProps) => {
    const { data: feeCategories } = useGetFeeCategoriesQuery();

    const options = useMemo(
        () =>
            feeCategories
                ?.filter(feeCategory => !(hideRecurringOption && feeCategory.type === FeeCategoryType.RECURRING))
                .map(feeCategory => ({ label: feeCategory.name, value: feeCategory.id })),
        [feeCategories, hideRecurringOption],
    );

    return <SelectField {...props} options={options} />;
};
