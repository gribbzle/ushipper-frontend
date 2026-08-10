import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FeeCategoryType } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getFeeCategoryTypeTranslate } from '@utils/translate/get-fee-category-type-translate';

export const FeeCategoryTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(FeeCategoryType).map(feCategoryType => ({
                label: getFeeCategoryTypeTranslate(feCategoryType),
                value: feCategoryType,
            })),
        [],
    );

    return <SelectField {...props} options={options} isClearable={false} />;
};
