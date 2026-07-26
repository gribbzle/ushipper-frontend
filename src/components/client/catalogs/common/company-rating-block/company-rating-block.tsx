import React from 'react';

import { Rating } from '@ui';
import { classname, translateByNamespace } from '@utils';

import { CompanyRatingBlockProps } from './company-rating-block.types';

import './company-rating-block.scss';

const t = translateByNamespace('client:order-review:popup');
const cn = classname('company-rating');

export const CompanyRatingBlock = ({ rating, reviewsTotal = 0 }: CompanyRatingBlockProps) => (
    <div className={cn()}>
        <Rating initialValue={rating ?? 0} allowFraction={true} />
        <span className={cn('reviews')}>
            {(rating ?? 0).toFixed(1)} / 5.0 {t('reviews-total-label', { count: reviewsTotal ?? 0 })}
        </span>
    </div>
);
