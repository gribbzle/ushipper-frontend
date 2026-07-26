import React from 'react';

import { Rating } from '@ui';
import { classname, formatToOneDecimal, translateByNamespace } from '@utils';

import './total-rating-block.scss';

type Props = {
    reviewsTotal: number;
    rating: number | null;
    size?: 'default' | 'large';
    isFulled?: boolean;
};

const cn = classname('total-rating-block');
const t = translateByNamespace('common:total-rating-block');

export const TotalRatingBlock = ({ rating, reviewsTotal, isFulled = true, size = 'default' }: Props) => (
    <div className={cn('', { size })}>
        <Rating initialValue={rating ?? 0} />
        <div className={cn('reviews-total')}>
            <span>
                {formatToOneDecimal(rating ?? 0)} / {isFulled && formatToOneDecimal(5)}
            </span>
            <span>{t('reviews-label', { count: reviewsTotal })}</span>
        </div>
    </div>
);
