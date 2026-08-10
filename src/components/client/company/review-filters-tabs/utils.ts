import cleanDeep from 'clean-deep';

import { ReviewsFilterEnum } from '@/enums/reviews-filter-enum';
import { ReviewTabsEnum } from '@/enums/review-tab-enum';

export type ReviewFiltersTabFromUrlParams = Partial<{
    rating: string | number;
    tabStatus: ReviewTabsEnum;
}>;

export const getAllFiltersFromUrlParams = (filtersFromUrl: ReviewFiltersTabFromUrlParams): ReviewFiltersTabFromUrlParams => {
    const { rating, tabStatus } = filtersFromUrl;

    let numericRating;

    if (typeof rating === 'string') {
        numericRating = rating === ReviewsFilterEnum.ALL ? rating : parseInt(rating, 10);
    } else {
        numericRating = rating;
    }

    return cleanDeep({ rating: numericRating, tabStatus });
};

export const getReviewsFiltersFromUrlParams = (filtersFromUrl: ReviewFiltersTabFromUrlParams): ReviewFiltersTabFromUrlParams => {
    const { rating } = filtersFromUrl;
    const filters: ReviewFiltersTabFromUrlParams = {};

    if (rating !== undefined && rating !== ReviewsFilterEnum.ALL) {
        filters.rating = rating;
    }

    return cleanDeep(filters);
};
