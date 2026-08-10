import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import {SelectField} from '@/fields/select-field';
import { translateOrderSource } from '@utils/translate/order/translate-order-source';

export const OrderSourceSelect = ({ label, input, ...rest }: FieldRenderProps<string>) => {
    const options = Object.values(OrderSourcesEnum)
        .filter(source => source !== OrderSourcesEnum.CENTRAL_DISPATCH)
        .map(source => ({
            label: translateOrderSource(source),
            value: source,
        }));

    return <Field label={label} component={SelectField} name={input.name} options={options} input={input} {...rest} />;
};
