import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { DateTypes } from '@/enums/date-types-enum';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

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
