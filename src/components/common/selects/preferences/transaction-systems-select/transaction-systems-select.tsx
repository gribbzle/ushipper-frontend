import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionSystemEnum } from '@/enums';
import { SelectField } from '@fields';
import { getTransactionSystemTranslate } from '@utils';

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
