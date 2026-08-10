import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { SelectOption } from '@/shared';
import {CheckboxMultiSelectInput} from '@/fields/checkbox-multi-input';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { useAppSelector } from '@store';
import { specializationByIdSelector } from '@store/common';
import { translateByNamespace } from '@utils/i18n';
import { getTransportCategoryTranslate } from '@utils/specialization';
import { requiredArray } from '@validators';

type CategoriesSelectProps = {
    specializationId: number;
};
const t = translateByNamespace('client:sign-up-page.form.business-details-step');

export const CategoriesSelect = ({ specializationId }: CategoriesSelectProps) => {
    const specialization = useAppSelector(specializationByIdSelector(specializationId));

    const options = useMemo<SelectOption<number>[]>(
        () =>
            specialization?.categories.map(category => ({
                label: getTransportCategoryTranslate(category.name),
                value: category.id,
            })) || [],
        [specialization],
    );

    if (!specialization || !options.length) {
        return null;
    }

    const { name, id } = specialization;

    return (
        <FormControl>
            <InputLabel required={true}>{t('category-label', { categoryName: name })}</InputLabel>
            <Field<number[]>
                name={`category-${id}`}
                component={props => <CheckboxMultiSelectInput {...props} options={options} />}
                validate={requiredArray}
                options={options}
            />
        </FormControl>
    );
};
