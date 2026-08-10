import React, { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import has from 'has-values';

import { OrderReviewPopup } from '@/components/client/orders/popups/order-review-popup/order-review-popup';
import { Button } from '@/components/common/button/button';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { CompanyType } from '@/enums/company-type';
import { useMeDriverRelated, useMeShipper } from '@/hooks/use-user-role-group';
import { useAppDispatch, useAppSelector } from '@store';
import { orderCarrierOrderSelector, orderShipperOrderSelector, reviewActions } from '@store/client';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';
import { Card, CardContent, CardHeader } from '@/components/ui/surfaces/card';
import { Paper } from '@/components/ui/surfaces/paper';
import { Rating, RatingStarIcon } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import './order-review-paper.scss';
import CloseIcon from '@/assets/icons/close-icon.svg';
import PencilWithLineIcon from '@/assets/icons/pencil-with-line.svg';
import StarIcon from '@/assets/icons/star-icon.svg';

const t = translateByNamespace('client:order-review');
const cn = classname('review-paper');

export const OrderReviewPaper = () => {
    const dispatch = useAppDispatch();
    const isMeShipper = useMeShipper();
    const isDriver = useMeDriverRelated();

    const [isVisible, setIsVisible] = useState(true);

    const userCompanyPublicId = useAppSelector(authorizedUserCompanyPublicIdSelector);
    const carrierOrder = useAppSelector(orderCarrierOrderSelector);
    const shipperOrder = useAppSelector(orderShipperOrderSelector);
    const relatedOrder = isMeShipper ? carrierOrder : shipperOrder;

    const handleShowPopup = useCallback(() => {
        dispatch(
            reviewActions.setOrderReviewPopupProps({
                isVisible: true,
                review: relatedOrder?.review ?? null,
                company: relatedOrder?.company ?? null,
            }),
        );
    }, [dispatch, relatedOrder]);

    const isCanEditReview = useMemo(
        () => !isDriver && relatedOrder?.review?.creator.company.publicId === userCompanyPublicId && !relatedOrder?.review?.reply,
        [userCompanyPublicId, relatedOrder?.review?.creator.company.publicId, relatedOrder?.review?.reply, isDriver],
    );

    if (!relatedOrder || !isVisible) {
        return null;
    }

    const { review, company } = relatedOrder;

    const title = relatedOrder.review
        ? t('header', { companyName: company.name })
        : t('header', { companyName: isMeShipper ? translateCompanyType(CompanyType.CARRIER) : translateCompanyType(CompanyType.SHIPPER) });

    return (
        <>
            <OrderReviewPopup />
            <Paper className={cn()}>
                <Card>
                    <CardHeader className={cn('header')}>
                        {title}
                        <IconButton Icon={CloseIcon} onClick={() => setIsVisible(false)} className={cn('close-btn')} />
                    </CardHeader>
                    {!review && (
                        <CardContent className={cn('content-without-feedback')}>
                            <span>
                                {t('rate-experience-with-label')} <strong>{company.name}</strong>
                            </span>
                            {!isDriver && (
                                <Button view='primary' size='medium' onClick={handleShowPopup}>
                                    <StarIcon /> {t('rate-btn-label', { companyType: company.type })}
                                </Button>
                            )}
                        </CardContent>
                    )}
                    {review && (
                        <CardContent className={cn('content-with-feedback')}>
                            <div>
                                <span className={cn('content-header')}>{t('overall-rating-label')}</span>
                                <div className={cn('rating')}>
                                    <strong>{review.rating.toFixed(1)}</strong>
                                    <Rating initialValue={review.rating} size={16} />
                                    <span className={cn('review-date')}>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                                {isCanEditReview && (
                                    <Button size='mini' className={cn('edit-feedback-btn')} onClick={handleShowPopup}>
                                        <PencilWithLineIcon /> {t('edit-feedback-btn-label')}
                                    </Button>
                                )}
                            </div>
                            {has(review.items) && (
                                <div>
                                    <span className={cn('content-header')}>{t('detailed-rating-label')}</span>
                                    <div className={cn('content-items')}>
                                        {review.items.map(item => (
                                            <div key={item.itemId}>
                                                <span>{item.title}</span>
                                                <RatingStarIcon size={16} filled={item.rating > 0} />
                                                <strong>{item.rating.toFixed(1)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
            </Paper>
        </>
    );
};
