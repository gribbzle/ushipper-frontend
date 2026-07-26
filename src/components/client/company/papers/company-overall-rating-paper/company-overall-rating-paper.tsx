import React, { useMemo } from 'react';

import { CompanyTotalRatingInfo, Paper } from '@/components';
import { RatingBar } from '@components';
import { useAppSelector } from '@store';
import { companyTotalRatingSelector } from '@store/admin';
import { classname, translateByNamespace } from '@utils';

import './company-overall-rating-paper.scss';

const t = translateByNamespace('client:company-page:overall-rating');
const cn = classname('company-overall-rating');

export const CompanyOverallRatingPaper = () => {
    const totalRating = useAppSelector(companyTotalRatingSelector);
    const sortedRatings = useMemo(() => totalRating?.perScore.slice().sort((a, b) => b.rating - a.rating), [totalRating?.perScore]);

    const body = useMemo(
        () =>
            totalRating && (
                <div className={cn('')}>
                    <CompanyTotalRatingInfo rating={totalRating.rating} reviewsTotal={totalRating.reviewsTotal} />
                    <div className={cn('rating-list')}>
                        {sortedRatings?.map(ratingData => (
                            <RatingBar key={ratingData.rating} {...ratingData} />
                        ))}
                    </div>
                </div>
            ),
        [sortedRatings, totalRating],
    );

    return <Paper body={body} title={t('title')} />;
};
