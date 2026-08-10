import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

type OptionsSelectProps = FieldRenderProps<string> & {
    validation: string;
};

const t = translateByNamespace('admin:accounting:initiate-account-payment-methods-popup');

export const AttributeOptionsSelect = ({ validation, input, ...props }: OptionsSelectProps) => {
    const options: SelectOption<string>[] = useMemo(() => {
        return validation.split('|').map(option => {
            const value = option.trim();
            const key = `${toKebabCase(input.name)}.${toKebabCase(value)}`;
            const translatedLabel = t(key);

            return {
                label: translatedLabel === `accounting.initiate-account-payment-methods-popup.${key}` ? value : translatedLabel,
                value: value,
            };
        });
    }, [validation, input.name]);

    return <SelectField options={options} input={input} {...props} />;
};
