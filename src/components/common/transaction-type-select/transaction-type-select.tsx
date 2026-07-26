import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionTypesEnum } from '@/enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:filters');

export const TransactionTypeSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(TransactionTypesEnum).map(type => ({
                label: t(type),
                value: type,
            })),
        [],
    );

    return <SelectField options={options} {...props} />;
};
