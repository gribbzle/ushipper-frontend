import React, { useMemo } from 'react';
import { Field, useField } from 'react-final-form';

import { TrailerCategoriesSelect } from '@/components/common/trailer-categories-select/trailer-categories-select';
import { SelectOption } from '@/shared';
import { FormControl, InputLabel } from '@fields';
import { useAppSelector } from '@store';
import { specializationByIdSelector } from '@store/common';
import { translateByNamespace } from '@utils/i18n';
import { getTransportCategoryTranslate, getTransportServiceTranslate } from '@utils/specialization';
import { requiredArray } from '@validators';

type TrailerCategoriesSelectWrapperProps = {
    specializationId: number;
};

const t = translateByNamespace('client:profile-settings.business-info.fields');

const TrailerCategoriesSelectWrapper = ({ specializationId }: TrailerCategoriesSelectWrapperProps) => {
    const specialization = useAppSelector(specializationByIdSelector(specializationId));

    const categoriesOptions = useMemo<SelectOption<number>[]>(
        () =>
            specialization?.categories.map(category => ({
                label: getTransportCategoryTranslate(category.name),
                value: category.id,
            })) || [],
        [specialization],
    );

    if (!specialization || !categoriesOptions.length) {
        return null;
    }

    return (
        <FormControl key={specializationId}>
            <InputLabel required={true}>{t('categories', { categoryName: getTransportServiceTranslate(specialization.name) })}</InputLabel>
            <Field<number[]>
                name={`category-${specializationId}`}
                component={TrailerCategoriesSelect}
                categoryId={specializationId}
                options={categoriesOptions}
                validate={requiredArray}
            />
        </FormControl>
    );
};

export const SpecializationCategoriesFields = () => {
    const {
        input: { value: specializations },
    } = useField<number[]>('specializations', { subscription: { value: true } });

    if (!specializations || specializations.length === 0) {
        return null;
    }

    return (
        <>
            {specializations.map(specializationId => (
                <TrailerCategoriesSelectWrapper key={specializationId} specializationId={specializationId} />
            ))}
        </>
    );
};
