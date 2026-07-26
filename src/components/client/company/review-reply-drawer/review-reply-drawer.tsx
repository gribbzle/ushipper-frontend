import React, { useCallback, useMemo } from 'react';

import { Button, Drawer, ReviewReplyForm } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { reviewActions, reviewReplyDrawerPropsSelector } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './review-reply-drawer.scss';

const cn = classname('review-reply-drawer');
const t = translateByNamespace('client:company-page:review-reply-drawer');
const formId = 'reviewReplyFormId';

export const ReviewReplyDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, reviewId, replyId, companyName, initialComment } = useAppSelector(reviewReplyDrawerPropsSelector);

    const user = useMemo(() => companyName ?? t('default-company-name'), [companyName]);

    const handleDrawerClose = useCallback(() => {
        dispatch(reviewActions.setReviewReplyPopupProps({ isVisible: false, companyName: null, reviewId: null, initialComment: null, replyId: null }));
    }, [dispatch]);

    const initialValues = useMemo(() => {
        return {
            comment: initialComment ?? null,
        };
    }, [initialComment]);

    const actions = useMemo(
        () => (
            <Button view='primary' type='submit' form={formId}>
                {t('send-btn-label')}
            </Button>
        ),
        [],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={
                <ReviewReplyForm
                    formId={formId}
                    reviewId={reviewId}
                    initialValues={initialValues}
                    companyName={user}
                    onAfterFormSubmit={handleDrawerClose}
                    replyId={replyId}
                />
            }
            actions={actions}
        />
    );
};
