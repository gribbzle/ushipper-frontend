import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TransactionTypeGroup } from '@/enums';
import { SelectField } from '@fields';
import { getTransactionTypeGroupTranslate, translateByNamespace } from '@utils';

const t = translateByNamespace('common:transaction-type-group');

export const PaymentTypeSelect = (props: FieldRenderProps<string>) => {
    const options = [
        { label: getTransactionTypeGroupTranslate(TransactionTypeGroup.INSTANT_PAYMENT), value: TransactionTypeGroup.INSTANT_PAYMENT },
        { label: t('not-cod'), value: TransactionTypeGroup.DELAYED_PAYMENT },
    ];

    return <SelectField options={options} {...props} />;
};
