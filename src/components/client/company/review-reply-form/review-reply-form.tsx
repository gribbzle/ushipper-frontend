import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { NullableFields } from '@/shared';
import { FormControl, InputLabel, TextField } from '@fields';
import { useCreateReviewReplyMutation, useUpdateReviewReplyMutation } from '@store/api/review-reply-api';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

const t = translateByNamespace('client:company-page:review-reply-drawer');
const translateNotification = translateByNamespace('client:company-page:notification');

type ReviewReplyFormState = NullableFields<{
    comment: string | null;
}>;

type Props = {
    formId: string;
    initialValues?: ReviewReplyFormState;
    reviewId: string | null;
    replyId: string | null;
    companyName: string;
    onAfterFormSubmit: () => void;
};

export const ReviewReplyForm = ({ formId, initialValues, replyId, reviewId, companyName, onAfterFormSubmit }: Props) => {
    const [createReviewReply] = useCreateReviewReplyMutation();
    const [updateReviewReply] = useUpdateReviewReplyMutation();

    const handleSubmit = useCallback(
        async (values: ReviewReplyFormState) => {
            if (!values.comment || values.comment.trim() === '') {
                toast.error<string>(translateNotification('empty-field-error'));

                return;
            }

            if (reviewId && !initialValues?.comment) {
                createReviewReply({ reviewId, comment: values.comment })
                    .unwrap()
                    .then(() => {
                        onAfterFormSubmit();
                        toast.success<string>(translateNotification('create-review-reply-success'));
                    })
                    .catch(e => {
                        toast.error<string>(translateNotification('create-review-reply-error'));
                    });
            } else if (reviewId && replyId) {
                updateReviewReply({ reviewId, replyId, comment: values.comment })
                    .unwrap()
                    .then(() => {
                        onAfterFormSubmit();
                        toast.success<string>(translateNotification('edit-review-reply-success'));
                    })
                    .catch(e => {
                        toast.error<string>(translateNotification('edit-review-reply-error'));
                    });
            }
        },
        [createReviewReply, initialValues, onAfterFormSubmit, replyId, reviewId, updateReviewReply],
    );

    return (
        <Form<ReviewReplyFormState>
            initialValues={initialValues}
            onSubmit={handleSubmit}
            render={({ handleSubmit }) => {
                return (
                    <form onSubmit={handleSubmit} id={formId}>
                        <FormControl>
                            <InputLabel>{t('comment-field-label', { user: companyName })}</InputLabel>
                            <Field
                                name='comment'
                                component={TextField}
                                multiline={true}
                                parse={value => value}
                                validate={required}
                                placeholder={t('comment-field-placeholder', { user: companyName })}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
