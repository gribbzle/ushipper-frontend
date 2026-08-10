import React, { useEffect } from 'react';

import {InputLabel} from '@/fields/input-label';
import {RatingField} from '@/fields/rating-field';
import { useAppSelector } from '@store';
import { useLazyGetReviewItemsQuery } from '@store/api/review';
import { orderReviewPopupPropsSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './review-items-fields.scss';

const t = translateByNamespace('client:order-review:fields');
const cn = classname('review-items-fields');

export const ReviewItemsFields = () => {
    const { company } = useAppSelector(orderReviewPopupPropsSelector);
    const [getItems, { data: items }] = useLazyGetReviewItemsQuery();

    useEffect(() => {
        if (company && company?.publicId) {
            getItems({ companyId: company.publicId });
        }
    }, [company, getItems]);

    return (
        <div className={cn()}>
            <span className={cn('label')}>{t('more-details-group-label')}</span>
            <div className={cn('list')}>
                {items?.map(item => (
                    <div key={item.id} className={cn('category')}>
                        <InputLabel>{item.title}</InputLabel>
                        <RatingField name={`item-${item.id}`} readonly={false} />
                    </div>
                ))}
            </div>
        </div>
    );
};
