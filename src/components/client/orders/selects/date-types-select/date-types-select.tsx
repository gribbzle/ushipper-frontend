import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { DateTypes } from '@/enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:date-types');

export const DateTypesSelect = ({ ...rest }: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(DateTypes).map(type => ({
                label: t(type),
                value: type,
            })),
        [],
    );

    return <SelectField isClearable={false} options={options} {...rest} />;
};
