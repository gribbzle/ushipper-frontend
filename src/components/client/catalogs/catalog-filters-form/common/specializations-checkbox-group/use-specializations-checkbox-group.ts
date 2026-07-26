import { useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';

import { useAppSelector } from '@store';
import { useGetSpecializationsQuery } from '@store/api/specializations-api';
import { catalogsSelectedFiltersSelector } from '@store/client';

import { SpecializationsFilter } from '../../catalog-filters-form.types';

export const useSpecializationsCheckBoxGroup = () => {
    const { data: specializations = [] } = useGetSpecializationsQuery();
    const { input } = useField<number[]>('specialization', { subscription: { value: true } });
    const [selectedSpecializations, setSelectedSpecializations] = useState<number[]>(input.value || []);
    const [anySpecialization, setAnySpecialization] = useState(false);
    const { change, getState } = useForm();
    const { specializations: specializationsFilters } = useAppSelector(catalogsSelectedFiltersSelector);

    useEffect(() => {
        if (specializations.length > 0) {
            setAnySpecialization(input.value?.length === specializations.length);
        }
    }, [input.value?.length, specializations]);

    useEffect(() => {
        if (!specializationsFilters) {
            setSelectedSpecializations([]);
            setAnySpecialization(false);
        }
    }, [specializationsFilters]);

    const handleCheckboxChange = useCallback(
        (id: number) => {
            setSelectedSpecializations(currentSelected => {
                const updatedValues = currentSelected.includes(id) ? currentSelected.filter(valueId => valueId !== id) : [...currentSelected, id];
                const currentSpecializations = getState().values.specializations || [];
                const specializationMap = new Map(currentSpecializations.map((spec: SpecializationsFilter) => [spec.id, spec]));
                const updatedSpecializations = updatedValues.map(val => specializationMap.get(val) || { id: val });

                setAnySpecialization(updatedSpecializations.length === specializations.length);

                change('specializations', updatedSpecializations);

                return updatedValues;
            });
        },
        [change, getState, specializations],
    );

    const onChangeAnySpecialization = useCallback(() => {
        setAnySpecialization(!anySpecialization);

        if (anySpecialization) {
            setSelectedSpecializations([]);
            change('specializations', []);
        } else {
            const allSpecializationIds = specializations.map(spec => spec.id);

            setSelectedSpecializations(allSpecializationIds);

            const allSpecializations = allSpecializationIds.map(id => ({ id: id }));

            change('specializations', allSpecializations);
        }
    }, [anySpecialization, change, specializations]);

    return { handleCheckboxChange, selectedSpecializations, specializations, anySpecialization, onChangeAnySpecialization };
};
