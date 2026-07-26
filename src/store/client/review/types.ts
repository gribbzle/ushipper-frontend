import { Creator } from '@/shared';

import { UserCompany } from '../../common';

export type OrderReviewPopupState = {
    isVisible: boolean;
    review: Review | null;
    company: UserCompany | null;
};

/**
 * Rating type.
 * Can be any number from 0 to 5, including fractional numbers.
 */
export type Rating = number;

export type ReviewsItems = {
    itemId: number;
    rating: Rating;
    title: string;
};

export type Review = {
    publicId: string;
    rating: Rating;
    items: ReviewsItems[];
    comment: string;
    company: UserCompany;
    creator: Creator;
    createdAt: string;
    reply: ReviewReply | null;
};

export type ReviewReplyDrawerState = {
    isVisible: boolean;
    companyName: string | null;
    reviewId: string | null;
    replyId: string | null;
    initialComment: string | null;
};

export type ReviewSliceState = {
    orderReviewPopup: OrderReviewPopupState;
    reviewReplyDrawer: ReviewReplyDrawerState;
};

export type ReviewReply = {
    publicId: string;
    creator: Creator;
    comment: string;
    createdAt: string;
};
