import React from 'react';
import { Field } from 'react-final-form';

import { LabeledCheckboxInput } from '@fields';
import { getTransportCategoryTranslate, getTransportServiceTranslate, translateByNamespace } from '@utils';

import { CatalogFiltersSubGroup } from '../../../catalog-filter-group';

import { useSpecializationCategoriesCheckBoxGroup } from './use-specialization-categories-checkbox-group';

const t = translateByNamespace('client:catalogs.filters');

export const SpecializationCategoriesCheckBoxGroup = ({ specializationId }: { specializationId: number }) => {
    const { handleCheckboxChange, selectedCategories, specialization } = useSpecializationCategoriesCheckBoxGroup(specializationId);

    if (!specialization) {
        return null;
    }

    return (
        <CatalogFiltersSubGroup title={t('categories', { categoryName: getTransportServiceTranslate(specialization.name) })}>
            {specialization.categories.map(category => (
                <Field
                    key={category.id}
                    name={`category-${category.id}`}
                    render={({ input }) => (
                        <LabeledCheckboxInput
                            label={getTransportCategoryTranslate(category.name)}
                            input={{
                                ...input,
                                value: selectedCategories.includes(category.id),
                                checked: selectedCategories.includes(category.id),
                                onChange: () => handleCheckboxChange(category.id),
                            }}
                            meta={{}}
                        />
                    )}
                />
            ))}
        </CatalogFiltersSubGroup>
    );
};
