import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { TransactionTypesEnum } from '@/enums';
import { SelectionButtonGroupInput } from '@fields';
import { getTransactionTypeTranslate } from '@utils/get-transaction-type-translate';

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
