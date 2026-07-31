import React, { memo } from 'react';

import { Review } from '@store/client';
import { classname } from '@utils/classname';

import { OrderReviewPopup } from '../../orders';
import { ReviewItem } from '../review-item';

import './reviews-list.scss';

type ReviewsListProps = {
    reviews: Review[];
};

const cn = classname('reviews-list');

export const ReviewsList = memo(({ reviews }: ReviewsListProps) => (
    <div className={cn()}>
        <OrderReviewPopup />
        {reviews.map(review => (
            <ReviewItem key={review.publicId} review={review} />
        ))}
    </div>
));

ReviewsList.displayName = 'ReviewsList';
