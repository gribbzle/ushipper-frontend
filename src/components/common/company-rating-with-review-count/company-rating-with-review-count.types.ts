import { Rating } from '@store/client';

export type CompanyRatingWithReviewCountProps = {
    rating: Rating | null;
    reviewsTotal: number | null;
    isOneStarDisplay?: boolean;
    view?: 'default' | 'old';
};
