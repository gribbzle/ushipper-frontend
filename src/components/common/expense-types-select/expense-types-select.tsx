import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { ExpenseTypeEnum } from '@/enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:expense-types');

export const ExpenseTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(ExpenseTypeEnum).map(expenseType => ({
                label: t(toKebabCase(expenseType)),
                value: expenseType,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
