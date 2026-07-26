import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FreightClassesEnum } from '@/enums';
import { SelectField } from '@fields';

export const FreightClassesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(FreightClassesEnum).map(val => ({
                label: val,
                value: val,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
