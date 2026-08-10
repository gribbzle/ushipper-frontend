import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionStatusesEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getTransactionStatusTranslate } from '@utils/translate/get-transaction-status-translate';

export const TransactionStatusSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(TransactionStatusesEnum).map(status => ({
        label: getTransactionStatusTranslate(status),
        value: status,
    }));

    return <SelectField options={options} {...props} />;
};
