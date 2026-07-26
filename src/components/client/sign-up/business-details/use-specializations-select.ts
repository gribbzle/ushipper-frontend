import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useFormState } from 'react-final-form';

import { SelectOption } from '@/shared';
import { useAppSelector } from '@store';
import { fetchedSpecializationsSelector } from '@store/common';
import { getTransportServiceTranslate } from '@utils';

export const useSpecializationSelect = () => {
    const specializations = useAppSelector(fetchedSpecializationsSelector);
    const form = useForm();
    const { values } = useFormState({ subscription: { values: true } });

    const clearUnselectedCategoryFields = useCallback(
        (specializationIds: number[]) => {
            const fieldsToRemove = Object.keys(form.getState().values).filter(
                key => key.startsWith('category-') && !specializationIds.some(id => key.endsWith(`-${id}`)),
            );

            if (fieldsToRemove.length > 0) {
                form.batch(() => {
                    fieldsToRemove.forEach(field => form.change(field, undefined));
                });
            }
        },
        [form],
    );

    useEffect(() => {
        const specializationIds = values.specializations || [];

        clearUnselectedCategoryFields(specializationIds);
    }, [values.specializations, clearUnselectedCategoryFields]);

    const options = useMemo<SelectOption<number>[]>(
        () => specializations.map(specialization => ({ label: getTransportServiceTranslate(specialization.name), value: specialization.id })),
        [specializations],
    );

    return { options };
};
