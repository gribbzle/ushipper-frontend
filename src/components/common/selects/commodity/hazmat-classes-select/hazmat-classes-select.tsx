import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CommodityHazmatClassEnum } from '@/enums/commodity/commodity-hazmat-classes-enum';
import {SelectField} from '@/fields/select-field';
import { getHazmatClassTranslate } from '@utils/translate/commodity/get-hazmat-class-translate';

export const HazmatClassesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(CommodityHazmatClassEnum).map(val => ({
                label: getHazmatClassTranslate(val),
                value: val,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
