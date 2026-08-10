import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { ReviewsFilterEnum } from '@/enums';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { LabeledCheckboxInput } from '@fields';
import { Rating } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useRatingCheckBoxGroup } from './use-rating-checkbox-group';

const t = translateByNamespace('client:catalogs.filters.rating-labels');
const cn = classname('catalog-filters-form');

export const RatingCheckBoxGroup = () => {
    const { onChangeAnyRating, handleCheckboxChange, selectedRating, anyRating } = useRatingCheckBoxGroup();

    const ratingCheckboxes = useMemo(
        () =>
            Object.values(ReviewsFilterEnum)
                .filter(value => typeof value === 'number')
                .map(value => ({
                    label: (
                        <div className={cn('option-label')}>
                            <Rating initialValue={value as number} />
                            {t(`${value}`)}
                        </div>
                    ),
                    value: value as number,
                })),
        [],
    );

    return (
        <>
            <NativeSwitch label={t('any-rating-switch')} checked={anyRating} onChange={onChangeAnyRating} />
            {ratingCheckboxes.map(option => (
                <Field
                    name={`rating-${option.value}`}
                    key={option.value}
                    render={({ input }) => (
                        <LabeledCheckboxInput
                            label={option.label}
                            input={{
                                ...input,
                                value: selectedRating.includes(option.value),
                                checked: selectedRating.includes(option.value),
                                onChange: () => handleCheckboxChange(option.value),
                            }}
                            meta={{}}
                        />
                    )}
                />
            ))}
        </>
    );
};
