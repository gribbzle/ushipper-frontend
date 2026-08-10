import React from 'react';
import { Field } from 'react-final-form';

import { Rating } from '@/components/ui/inputs/rating';

type Props = {
    name: string;
    iconsCount?: number;
    size?: number;
    readonly?: boolean;
    onChange?: (value: string) => void;
};

export const RatingField = ({ name, iconsCount, readonly, size, onChange }: Props) => (
    <Field name={name}>
        {({ input }) => (
            <Rating
                initialValue={Number(input.value)}
                iconsCount={iconsCount}
                readonly={readonly}
                size={size}
                onChange={rating => {
                    input.onChange(rating);
                    onChange?.(rating);
                }}
            />
        )}
    </Field>
);
