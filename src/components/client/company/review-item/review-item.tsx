import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { OverallRatingBlock } from '@/components/common/overall-rating-block/overall-rating-block';
import { TextAccordion } from '@/components/common/text-accordion/text-accordion';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { MessageTextLeftIcon, PencilWithLineIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { Review } from '@store/client';
import { reviewActions } from '@store/client';
import { authorizedUserCompanyPublicIdSelector, authorizedUserNameSelector } from '@store/global';
import { RatingOneStarIcon } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OrderItemInfoColumn } from '../../orders/order-item-info-column';

import { ReviewReplyBlock } from './review-reply-block';
import { ReviewerInfoBlock } from './reviewer-info-block';

import './review-item.scss';

type Props = {
    review: Review;
};

const t = translateByNamespace('client:company-page:review');
const cn = classname('review-item');

export const ReviewItem = ({ review }: Props) => {
    const { company, reply, creator, items, comment } = review;
    const dispatch = useAppDispatch();

    const userCompanyPublicId = useAppSelector(authorizedUserCompanyPublicIdSelector);
    const authorizedUserName = useAppSelector(authorizedUserNameSelector);

    const isCanCreateReply = useMemo(() => {
        return userCompanyPublicId === company.publicId && !reply;
    }, [userCompanyPublicId, company.publicId, reply]);

    const isCanEditReview = useMemo(() => {
        return userCompanyPublicId === creator.company.publicId && authorizedUserName === creator.name && !reply;
    }, [userCompanyPublicId, creator.company.publicId, authorizedUserName, creator.name, reply]);

    const handleCreateReviewReply = useCallback(() => {
        dispatch(
            reviewActions.setReviewReplyPopupProps({
                isVisible: true,
                companyName: creator.company.name,
                reviewId: review.publicId,
                initialComment: null,
                replyId: null,
            }),
        );
    }, [creator.company.name, dispatch, review.publicId]);

    const handleEditReview = useCallback(() => {
        dispatch(
            reviewActions.setOrderReviewPopupProps({
                isVisible: true,
                review,
                company: company,
            }),
        );
    }, [company, dispatch, review]);

    const children = useMemo(
        () => (
            <>
                {comment && <TextAccordion text={comment} />}
                {isCanCreateReply && (
                    <Button size='mini' onClick={handleCreateReviewReply}>
                        <MessageTextLeftIcon /> {t('reply-btn-label')}
                    </Button>
                )}
                {isCanEditReview && (
                    <Button size='mini' onClick={handleEditReview}>
                        <PencilWithLineIcon /> {t('edit-review-btn-label')}
                    </Button>
                )}
            </>
        ),
        [comment, isCanCreateReply, handleCreateReviewReply, isCanEditReview, handleEditReview],
    );

    return (
        <Paper
            body={
                <div className={cn()}>
                    <ReviewerInfoBlock company={creator.company} />
                    <div className={cn('wrapper')}>
                        <OverallRatingBlock review={review} className={cn('rating-info')}>
                            {children}
                        </OverallRatingBlock>
                        {reply && <ReviewReplyBlock reply={reply} companyNameReviewer={company.name} reviewId={review.publicId} />}
                    </div>
                    {items.length > 0 && (
                        <OrderItemInfoColumn title={t('detailed-rating-label')} className={cn('rating-info')}>
                            <div className={cn('rating-items')}>
                                {items.map(item => (
                                    <div key={item.itemId}>
                                        <span>{item.title}</span>
                                        <RatingOneStarIcon initialValue={item.rating} />
                                        <strong>{item.rating.toFixed(1)}</strong>
                                    </div>
                                ))}
                            </div>
                        </OrderItemInfoColumn>
                    )}
                </div>
            }
        />
    );
};
