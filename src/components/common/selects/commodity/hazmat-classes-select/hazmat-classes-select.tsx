import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CommodityHazmatClassEnum } from '@/enums';
import { SelectField } from '@fields';
import { getHazmatClassTranslate } from '@utils';

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
