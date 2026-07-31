import React, { useMemo } from 'react';

import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { OrderSourcesEnum } from '@/enums';
import { ExternalCDShipper, ExternalCompany, ExternalSDShipper } from '@store/client';
import { classname } from '@utils/classname';

import './external-broker-rating.scss';

type ExternalBrokerRatingProps = {
    externalCompany?: ExternalCompany | null;
    orderSource: OrderSourcesEnum | null;
    externalShipper?: ExternalCDShipper | ExternalSDShipper | null;
};
const cn = classname('external-broker-rating');

export const ExternalBrokerRating = ({ externalCompany, orderSource, externalShipper }: ExternalBrokerRatingProps) => {
    const { oldRating, oldCountRating, countRating, rating } = externalCompany || {};

    const isCDShipper = orderSource && [OrderSourcesEnum.CENTRAL_DISPATCH_PARSED, OrderSourcesEnum.CENTRAL_DISPATCH].includes(orderSource);
    const isSDShipper = orderSource === OrderSourcesEnum.SUPER_DISPATCH_PARSED;

    const ratingFromShipper = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.overallRating?.averageRating;
    }, [externalShipper, isCDShipper]);

    const countRatingFromShipper = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.overallRating?.totalAmount;
    }, [externalShipper, isCDShipper]);

    const currentOldRating = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.rating;
        if (isSDShipper) return (externalShipper as ExternalSDShipper)?.ratingDetails?.overallRating;
    }, [externalShipper, isSDShipper, isCDShipper]);

    const currentOldCountRating = useMemo(() => {
        if (isCDShipper) return (externalShipper as ExternalCDShipper)?.numberOfRatings;
        if (isSDShipper) return (externalShipper as ExternalSDShipper)?.ratingDetails?.totalRatingCount;
    }, [externalShipper, isSDShipper, isCDShipper]);

    if (!externalShipper && !externalCompany) {
        return null;
    }

    return (
        <div className={cn('')}>
            <CompanyRatingWithReviewCount
                rating={currentOldRating ?? oldRating ?? 0}
                reviewsTotal={currentOldCountRating ?? oldCountRating ?? 0}
                isOneStarDisplay={true}
                view='old'
            />
            {isCDShipper && (
                <CompanyRatingWithReviewCount
                    rating={ratingFromShipper ?? rating ?? 0}
                    reviewsTotal={countRatingFromShipper ?? countRating ?? 0}
                    isOneStarDisplay={true}
                />
            )}
        </div>
    );
};
