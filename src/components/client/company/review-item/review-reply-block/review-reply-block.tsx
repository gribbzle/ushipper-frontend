import React, { useCallback } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders';
import { Button } from '@/components/common/button/button';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { PencilWithLineIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { reviewActions, ReviewReply } from '@store/client';
import { authorizedUserNameSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './review-reply-block.scss';

type Props = {
    reply: ReviewReply;
    reviewId: string;
    companyNameReviewer: string;
};

const t = translateByNamespace('client:company-page:reply');
const translateCompanyTypes = translateByNamespace('common:company-types');
const cn = classname('review-reply-block');

export const ReviewReplyBlock = ({ reply, reviewId, companyNameReviewer }: Props) => {
    const dispatch = useAppDispatch();
    const { creator, comment, publicId } = reply;
    const authorizedUserName = useAppSelector(authorizedUserNameSelector);

    const isCanEditReply = creator.name === authorizedUserName;

    const handleFeedbackEdit = useCallback(() => {
        dispatch(
            reviewActions.setReviewReplyPopupProps({
                isVisible: true,
                companyName: companyNameReviewer,
                reviewId,
                initialComment: comment,
                replyId: publicId,
            }),
        );
    }, [comment, companyNameReviewer, dispatch, publicId, reviewId]);

    return (
        <OrderItemInfoColumn title={t('title', { user: creator ? translateCompanyTypes(creator.company.type) : '' })} className={cn()}>
            <div className={cn('content')}>
                <UserInfoBlock avatar={creator.avatar} name={creator.name} roleName={creator.company.name} />
                <span className={cn('comment')}>{comment}</span>
                {isCanEditReply && (
                    <Button size='mini' className={cn('edit-feedback-btn')} onClick={handleFeedbackEdit}>
                        <PencilWithLineIcon /> {t('edit-feedback-btn-label')}
                    </Button>
                )}
            </div>
        </OrderItemInfoColumn>
    );
};
