import React, { useCallback, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import parseAndShowAxiosError from '@/utils/parse-axios-error';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {RatingField} from '@/fields/rating-field';
import {TextField} from '@/fields/text-field';
import { useMeShipper } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersApi } from '@store/api/orders-api';
import { ReviewAspect, ReviewFormValues, useCreateReviewMutation, useUpdateReviewMutation } from '@store/api/review';
import { orderPublicIdSelector, orderReviewPopupPropsSelector, Review } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import { ReviewItemsFields } from './review-items-fields';

import './order-review-form.scss';

const translateNotifications = translateByNamespace('client:order-review:notifications');
const t = translateByNamespace('client:order-review:fields');
const cn = classname('order-review-form');

type Props = {
    formId: string;
    onAfterFormSubmit?: () => void;
    onChangeRating?: (value?: string) => void;
    review: Review | null;
};

type ReviewItemsFormValues = {
    [key: `item-${number}`]: number;
};

const createItemsArray = (values: Record<string, any>): { itemId: number; rating: number }[] => {
    return Object.keys(values).reduce<{ itemId: number; rating: number }[]>((acc, key) => {
        if (key.startsWith('item-')) {
            const itemId = parseInt(key.split('-')[1], 10);
            const rating = parseFloat(values[key] as string);

            acc.push({ itemId, rating });
        }

        return acc;
    }, []);
};

const transformReviewItemsToFormValues = (items: ReviewAspect[]): ReviewItemsFormValues => {
    const entries = items.map(item => [`item-${item.itemId}`, item.rating]);

    return Object.fromEntries(entries);
};

export const OrderReviewForm = ({ formId, onAfterFormSubmit, onChangeRating }: Props) => {
    const orderId = useAppSelector(orderPublicIdSelector);
    const isMeShipper = useMeShipper();
    const { company, review } = useAppSelector(orderReviewPopupPropsSelector);
    const [createReview] = useCreateReviewMutation();
    const [updateReview] = useUpdateReviewMutation();
    const companyType = isMeShipper ? translateCompanyType('carrier') : translateCompanyType('shipper');

    const initialValues = useMemo(() => {
        if (!review) return {};
        const items = transformReviewItemsToFormValues(review.items);

        return {
            rating: review.rating,
            comment: review.comment,
            ...items,
        };
    }, [review]);

    const dispatch = useAppDispatch();

    const handleFormSubmit = useCallback(
        async (values: ReviewFormValues) => {
            const items = createItemsArray(values);
            const { comment, rating } = values;
            const requestData = {
                rating,
                comment,
                items,
            };

            if (orderId && !review) {
                createReview({ orderId, ...requestData })
                    .unwrap()
                    .then(() => {
                        onAfterFormSubmit?.();
                        toast.success(translateNotifications<string>('create-review-success'));
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
                    })
                    .catch(e => {
                        parseAndShowAxiosError(e, translateNotifications('create-review-error'));
                    });
            }

            if (review) {
                updateReview({ reviewId: review.publicId, ...requestData })
                    .unwrap()
                    .then(() => {
                        onAfterFormSubmit?.();
                        toast.success(translateNotifications<string>('edit-review-success'));
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
                    })
                    .catch(e => {
                        parseAndShowAxiosError(e, translateNotifications('edit-review-error'));
                    });
            }
        },
        [dispatch, createReview, onAfterFormSubmit, orderId, updateReview, review],
    );

    return (
        <Form
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            subscription={{ values: true }}
            render={({ handleSubmit, values }) => (
                <form className={cn()} onSubmit={handleSubmit} id={formId}>
                    <div className={cn('overall-field')}>
                        <span className={cn('label')}>{t('rating-label', { companyType })}</span>
                        <RatingField name='rating' size={32} readonly={false} onChange={onChangeRating} />
                        {values.rating && <span className={cn('count')}>{Number(values.rating).toFixed(1)}</span>}
                    </div>
                    {values.rating && (
                        <>
                            <ReviewItemsFields />
                            <FormControl>
                                <InputLabel>{t('comment-label', { companyType })}</InputLabel>
                                <Field
                                    name='comment'
                                    component={TextField}
                                    placeholder={t('comment-placeholder', { companyName: company?.name ?? '' })}
                                    multiline={true}
                                    resize='none'
                                />
                            </FormControl>
                        </>
                    )}
                </form>
            )}
        />
    );
};
