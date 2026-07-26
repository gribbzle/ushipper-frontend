import React, { useCallback } from 'react';
import { Rating as StarRating, RatingProps } from 'react-simple-star-rating';

import { StarIcon } from '@icons';
import { classname } from '@utils';

import './rating.scss';

const cn = classname('rating');

type RatingStarIconProps = {
    size: number;
    filled?: boolean;
};

export const RatingStarIcon = ({ size, filled }: RatingStarIconProps) => (
    <StarIcon width={size} height={size} className={cn(filled ? 'filled-star' : 'empty-star')} />
);

type Props = RatingProps & {
    onChange?: (value: string) => void;
};

export const Rating = ({ size = 16, readonly = true, allowFraction = false, onChange, ...rest }: Props) => {
    const handleRating = useCallback(
        (value: number) => {
            onChange?.(value.toString());
        },
        [onChange],
    );

    return (
        <StarRating
            emptyIcon={<RatingStarIcon size={size} />}
            fillIcon={<RatingStarIcon size={size} filled={true} />}
            readonly={readonly}
            allowFraction={allowFraction}
            onClick={handleRating}
            size={size}
            {...rest}
        />
    );
};

export const RatingOneStarIcon = ({ initialValue, ...rest }: Props) => {
    const initialValueForPercent = (initialValue ?? 0) / 5;

    return <Rating initialValue={initialValueForPercent} iconsCount={1} {...rest} allowFraction={true} />;
};
