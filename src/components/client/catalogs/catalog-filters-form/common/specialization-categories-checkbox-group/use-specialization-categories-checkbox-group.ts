import { useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';

import { useAppSelector } from '@store';
import { catalogsSelectedFiltersSelector } from '@store/client';
import { specializationByIdSelector } from '@store/common';

import { SpecializationsFilter } from '../../catalog-filters-form.types';

export const useSpecializationCategoriesCheckBoxGroup = (specializationId: number) => {
    const specialization = useAppSelector(specializationByIdSelector(specializationId));
    const { input } = useField<number[]>(`categories-${specializationId}`, { subscription: { value: true } });
    const [selectedCategories, setSelectedCategories] = useState<number[]>(input.value || []);
    const { change, getState } = useForm();
    const { specializations: specializationsFilters } = useAppSelector(catalogsSelectedFiltersSelector);

    useEffect(() => {
        const specializationsFilter = specializationsFilters?.find((filter: SpecializationsFilter) => filter.id === specializationId);

        if (specializationsFilter?.categories?.length === 0) {
            setSelectedCategories([]);
        }
    }, [specializationsFilters, specializationId]);

    const handleCheckboxChange = useCallback(
        (id: number) => {
            setSelectedCategories(currentSelected => {
                const updatedCategories = currentSelected.includes(id) ? currentSelected.filter(valueId => valueId !== id) : [...currentSelected, id];
                const specializations = getState().values['specializations'];

                const updatedSpecializations = specializations.map((specialization: SpecializationsFilter) =>
                    specialization.id === specializationId ? { ...specialization, categories: updatedCategories.map(val => ({ id: val })) } : specialization,
                );

                change('specializations', updatedSpecializations);

                return updatedCategories;
            });
        },
        [change, getState, specializationId],
    );

    return { handleCheckboxChange, selectedCategories, specialization };
};
