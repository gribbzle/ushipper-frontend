import React, { ReactNode } from 'react';
import { format } from 'date-fns';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { Review } from '@store/client';
import { Rating } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './overall-rating-block.scss';

const cn = classname('overall-rating-block');
const t = translateByNamespace('client:order-review');

type Props = {
    review: Review;
    children?: ReactNode;
    className?: string;
};

export const OverallRatingBlock = ({ review, children, className }: Props) => (
    <OrderItemInfoColumn className={className} title={t('overall-rating-label')}>
        <div className={cn('')}>
            <span className={cn('count')}>{(review.rating ?? 0).toFixed(1)}</span>
            <Rating initialValue={review.rating} />
            <span className={cn('create-date')}>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
        </div>
        {children}
    </OrderItemInfoColumn>
);
