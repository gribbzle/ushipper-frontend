import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { TransactionTypesEnum } from '@/enums';
import { SelectionButtonOption } from '@components';
import { SelectionButtonGroupInput } from '@fields';
import { getTransactionTypeTranslate } from '@utils';

import { TransactionTypeSelectionButtonGroupProps } from './transaction-type-selection-button-group.types';

export const TransactionTypeSelectionButtonGroup = ({ context, ...rest }: TransactionTypeSelectionButtonGroupProps) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            Object.values(TransactionTypesEnum).map(type => ({
                label: getTransactionTypeTranslate(type, context),
                value: type,
            })),
        [context],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
