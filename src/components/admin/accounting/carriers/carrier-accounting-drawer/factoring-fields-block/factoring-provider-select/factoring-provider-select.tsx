import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FactoringProvider } from '@/enums/company/factoring-provider';
import {SelectField} from '@/fields/select-field';
import { getFactoringProviderTranslation } from '@utils/translate/accounting/get-factoring-provider-translation';

export const FactoringProviderSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(FactoringProvider).map(val => ({
        label: getFactoringProviderTranslation(val),
        value: val,
    }));

    return <SelectField {...props} options={options} isClearable={false} />;
};
