import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { InstantTermPaymentType } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:orders-page:cod-cop-order-action-tag');

export const ReceiptStatusSelect = (props: FieldRenderProps<string>) => {
    const options = [
        {
            label: t('pending'),
            value: InstantTermPaymentType.RECIPIENT_COMPANY,
        },
        {
            label: t('paid'),
            value: InstantTermPaymentType.RECIPIENT_COMPANY_PAID,
        },
        {
            label: t('declined'),
            value: InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED,
        },
    ];

    return <SelectField options={options} {...props} />;
};
