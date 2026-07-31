import React from 'react';

import { Rating } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './company-total-rating-info.scss';

type Props = {
    rating: number | null;
    reviewsTotal: number;
};

const t = translateByNamespace('client:order-review:popup');
const cn = classname('company-total-rating-info');

export const CompanyTotalRatingInfo = ({ rating, reviewsTotal }: Props) => (
    <div className={cn('')}>
        <Rating initialValue={rating ?? 0} allowFraction={true} />
        <span className={cn('reviews')}>
            {(rating ?? 0).toFixed(1)} / 5.0 {t('reviews-total-label', { count: reviewsTotal })}
        </span>
    </div>
);
