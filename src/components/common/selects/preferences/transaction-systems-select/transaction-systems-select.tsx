import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionSystemEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getTransactionSystemTranslate } from '@utils/translate/preferences/get-transaction-system-translate';

export const TransactionSystemSelect = ({ ...props }: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(TransactionSystemEnum).map(type => ({
                label: getTransactionSystemTranslate(type),
                value: type,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
