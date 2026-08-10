import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionTypesEnum } from '@/enums/transactions/transaction-types-enum';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

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
