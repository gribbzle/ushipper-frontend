import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { CompanyType } from '@/enums/company-type';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:company-types');

export const CompanyTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(CompanyType).map(type => ({
                label: t(toKebabCase(type)),
                value: type,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
