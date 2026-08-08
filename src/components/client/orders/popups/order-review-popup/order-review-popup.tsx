import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { OrderReviewForm } from '@/components/client/orders/forms/order-review-form/order-review-form';
import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { Popup } from '@/components/common/popup/popup';
import { useMeShipper } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { orderReviewPopupPropsSelector, reviewActions } from '@store/client';
import { Rating } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import './order-review-popup.scss';

const cn = classname('order-review-popup');
const t = translateByNamespace('client:order-review:popup');
const formId = 'orderReviewForm';

export const OrderReviewPopup = () => {
    const isMeShipper = useMeShipper();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { isVisible, company, review } = useAppSelector(orderReviewPopupPropsSelector);

    const handleClose = useCallback(() => {
        dispatch(reviewActions.setOrderReviewPopupProps({ isVisible: false, review: null, company: null }));
    }, [dispatch]);

    useEffect(() => {
        setIsSubmitDisabled(!review);
    }, [review]);

    const handleChangeRating = useCallback((value?: string) => (value ? setIsSubmitDisabled(false) : setIsSubmitDisabled(true)), []);

    const actions = useMemo(
        () => (
            <>
                <Button type='submit' size='small' view='primary' disabled={isSubmitDisabled} form={formId}>
                    {t('submit-btn-label')}
                </Button>
                <Button size='small' onClick={handleClose} type='button'>
                    {t('cancel-btn-label')}
                </Button>
            </>
        ),
        [handleClose, isSubmitDisabled],
    );

    const description = useMemo(
        () => (
            <>
                <AlertBlock>
                    {t('alert-text', {
                        companyType: isMeShipper ? translateCompanyType('carrier') : translateCompanyType('shipper'),
                    })}{' '}
                    {company?.publicId && (
                        <Link href={`${router.basePath}/client/companies/${company.publicId}`} target='_blank' rel='noopener noreferrer'>
                            {t('link-label')}
                        </Link>
                    )}
                </AlertBlock>
                <OrderReviewForm onAfterFormSubmit={handleClose} formId={formId} onChangeRating={handleChangeRating} review={review} />
            </>
        ),
        [isMeShipper, company?.publicId, router.basePath, handleClose, handleChangeRating, review],
    );

    const title = useMemo(
        () => (
            <>
                {company?.name}
                <div className={cn('rating-total')}>
                    <Rating initialValue={company?.rating ?? 0} />
                    <span className={cn('reviews-total')}>
                        {(company?.rating ?? 0).toFixed(1)} {t('reviews-total-label', { count: company?.reviewsTotal ?? 0 })}
                    </span>
                </div>
            </>
        ),
        [company],
    );

    return <Popup className={cn()} isOpen={isVisible} description={description} title={title} actions={actions} onClose={handleClose} />;
};
