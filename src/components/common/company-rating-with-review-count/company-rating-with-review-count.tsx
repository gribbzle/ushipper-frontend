import React from 'react';

import { Rating, RatingOneStarIcon } from '@ui';
import { classname } from '@utils/classname';

import { CompanyRatingWithReviewCountProps } from './company-rating-with-review-count.types';

import './company-rating-with-review-count.scss';

const cn = classname('company-rating-with-review-count');

export const CompanyRatingWithReviewCount = ({ rating, reviewsTotal, isOneStarDisplay = false, view = 'default' }: CompanyRatingWithReviewCountProps) => (
    <div className={cn('', { view })}>
        {isOneStarDisplay ? <RatingOneStarIcon initialValue={rating ?? 0} /> : <Rating initialValue={rating ?? 0} />}
        <span>
            {view === 'old' ? `${rating ?? 0}%` : `${(rating ?? 0).toFixed(1)} / 5`} ({reviewsTotal ?? 0})
        </span>
    </div>
);
