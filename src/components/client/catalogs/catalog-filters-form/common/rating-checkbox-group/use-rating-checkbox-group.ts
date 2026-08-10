import { useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';

import { ReviewsFilterEnum } from '@/enums/reviews-filter-enum';
import { useAppSelector } from '@store';
import { catalogsSelectedFiltersSelector } from '@store/client';

const ALL_RATING_VALUES = Object.values(ReviewsFilterEnum)
    .filter(value => typeof value === 'number')
    .map(value => value as number);

const createRatingObjects = (ratings: number[]) =>
    ratings.map(value => ({
        from: value,
        to: value === 5 ? 5 : value + 1,
    }));

export const useRatingCheckBoxGroup = () => {
    const { input } = useField<number[]>('rating', { subscription: { value: true } });
    const [selectedRating, setSelectedRating] = useState<number[]>(input.value || []);
    const [anyRating, setAnyRating] = useState(false);
    const { change } = useForm();
    const { ratings } = useAppSelector(catalogsSelectedFiltersSelector);

    useEffect(() => {
        if (!ratings) {
            setSelectedRating([]);
            setAnyRating(false);
        }
    }, [ratings]);

    useEffect(() => {
        setSelectedRating(input.value || []);
        setAnyRating(input.value?.length === ALL_RATING_VALUES.length);
    }, [input.value]);

    const handleCheckboxChange = useCallback(
        (val: number) => {
            setSelectedRating(currentSelected => {
                const isSelected = currentSelected.includes(val);
                const updatedSelected = isSelected ? currentSelected.filter(id => id !== val) : [...currentSelected, val];

                setAnyRating(updatedSelected.length === ALL_RATING_VALUES.length);

                change('ratings', createRatingObjects(updatedSelected));

                return updatedSelected;
            });
        },
        [change],
    );

    const onChangeAnyRating = useCallback(() => {
        setAnyRating(!anyRating);
        setSelectedRating(anyRating ? [] : ALL_RATING_VALUES);

        change('ratings', anyRating ? [] : createRatingObjects(ALL_RATING_VALUES));
    }, [anyRating, change]);

    return { onChangeAnyRating, handleCheckboxChange, selectedRating, anyRating };
};
