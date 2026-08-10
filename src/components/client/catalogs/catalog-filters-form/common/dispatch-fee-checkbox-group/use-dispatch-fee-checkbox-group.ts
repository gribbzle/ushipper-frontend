import { useCallback, useEffect, useMemo, useState } from 'react';
import { useField, useForm } from 'react-final-form';

import { DispatchFeeFilterEnum } from '@/enums/dispatch-fee-filter-enum';
import { useAppSelector } from '@store';
import { catalogsSelectedFiltersSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

import { dispatchFeeRanges } from './dispatch-fee-checkbox-group.types';

const t = translateByNamespace('client:catalogs.filters.dispatch-fee-labels');

export const useDispatchFeeCheckBoxGroup = () => {
    const { input } = useField<number[]>('dispatchFees', { subscription: { value: true } });
    const [selectedValues, setSelectedValues] = useState<number[]>(input.value || []);
    const { change } = useForm();
    const { dispatchFees } = useAppSelector(catalogsSelectedFiltersSelector);

    useEffect(() => {
        setSelectedValues(currentSelected => {
            if (currentSelected.length < dispatchFeeRanges.size && currentSelected.includes(Infinity)) {
                const updatedSelectedValues = currentSelected.filter(id => id !== Infinity);

                change(
                    'dispatchFees',
                    updatedSelectedValues.map(valueId => dispatchFeeRanges.get(valueId) || valueId),
                );

                return updatedSelectedValues;
            } else if (currentSelected.length === dispatchFeeRanges.size - 1 && !currentSelected.includes(Infinity)) {
                const updatedSelectedValues = [...currentSelected, Infinity];

                change(
                    'dispatchFees',
                    updatedSelectedValues.map(valueId => dispatchFeeRanges.get(valueId) || valueId),
                );

                return updatedSelectedValues;
            }

            return currentSelected;
        });
    }, [change, input.value]);

    const handleCheckboxChange = useCallback(
        (id: number) => {
            setSelectedValues(currentSelected => {
                let updatedSelectedValues;

                if (id === Infinity) {
                    updatedSelectedValues = currentSelected.includes(id) ? [] : Array.from(dispatchFeeRanges.keys());
                } else {
                    updatedSelectedValues = currentSelected.includes(id) ? currentSelected.filter(valueId => valueId !== id) : [...currentSelected, id];
                }

                change(
                    'dispatchFees',
                    updatedSelectedValues.map(valueId => dispatchFeeRanges.get(valueId) || valueId),
                );

                return updatedSelectedValues;
            });
        },
        [change],
    );

    useEffect(() => {
        if (!dispatchFees) {
            setSelectedValues([]);
        }
    }, [dispatchFees]);

    const dispatchFeeCheckboxes = useMemo(
        () =>
            Object.values(DispatchFeeFilterEnum)
                .filter(value => typeof value === 'number')
                .map(value => ({
                    label: t(`${value}`.toLowerCase()),
                    value: value as number,
                })),
        [],
    );

    return { handleCheckboxChange, selectedValues, dispatchFeeCheckboxes };
};
