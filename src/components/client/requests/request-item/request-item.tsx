import React, { useCallback, useMemo, useState } from 'react';
import { toKebabCase } from 'js-convert-case';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { OfferToRequestStatusesEnum, OrderStatus } from '@/enums';
import { RequestStatusesEnum } from '@/enums';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { calculateTotalPayment, getFinalPaymentAmount, getPaymentPerDistance } from '@/utils/payment';
import { AlertBlock, Button, CompanyRatingWithReviewCount, OrderTag, Paper, RequestDates } from '@components';
import { Ellipse, UserIcon } from '@icons';
import { orderOffersApi, useCancelOfferMutation } from '@store/api/order-offers';
import { OrderRequest, orderRequestsApi, usePartiallyUpdateRequestMutation } from '@store/api/order-requests-api';
import { Load } from '@store/client';
import { requestsSliceActions } from '@store/client/requests/slice';
import { classname, diffForHumans, formatToCurrency, translateByNamespace, translateCompanyType } from '@utils';

import { MessageButton } from './message-button';

import './request-item.scss';

const cn = classname('request-item');
const t = translateByNamespace('client:requests-page:drawer:request-item');

type Props = {
    request: OrderRequest;
    order: Load;
    hideButtons?: boolean;
};

export const RequestItem = ({ request, order, hideButtons }: Props) => {
    const { paymentPrice, pickupAt, deliveryAt, carrierCompany, comment, createdAt, status } = request;

    const [isBodyVisible, setIsBodyVisible] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

    const sendOffer = () => {
        dispatch(
            requestsSliceActions.setRequestDrawer({
                isOpen: true,
                order: order,
                request: request,
            }),
        );
    };

    const [updateRequest] = usePartiallyUpdateRequestMutation();
    const [cancelOffer] = useCancelOfferMutation();
    const declineRequestHandler = () => {
        updateRequest({
            publicOrderId: router.query.requestsOrderId as string,
            publicRequestId: request.publicId,
            data: {
                status: RequestStatusesEnum.DECLINED,
            },
        })
            .unwrap()
            .then(() => {
                toast.success(t<string>('declined-success'));
            })
            .catch(e => {
                parseAndShowAxiosError(e);
            });
    };

    const cancelOfferHandler = async () => {
        if (request.latestOffer?.publicId) {
            await cancelOffer(request.latestOffer?.publicId)
                .unwrap()
                .then(() => {
                    toast.success(t<string>('cancel-success'));
                    dispatch(orderRequestsApi.util.invalidateTags([{ type: 'Requests', id: 'LIST' }]));
                    dispatch(
                        orderOffersApi.util.invalidateTags([
                            { type: 'Offers', id: 'LIST' },
                            { type: 'Offers', id: request.latestOffer?.publicId },
                        ]),
                    );
                })
                .catch(e => {
                    parseAndShowAxiosError(e);
                });
        }
    };

    const toggleBodyVisibility = useCallback(() => {
        setIsBodyVisible(!isBodyVisible);
    }, [isBodyVisible]);

    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${carrierCompany.publicId}`;

        window.open(aliasPath, '_blank');
    }, [carrierCompany.publicId]);

    const isDeclinedByShipper = useMemo(
        () =>
            (status === RequestStatusesEnum.DECLINED && !request.latestOffer) ||
            (status === RequestStatusesEnum.DECLINED && request.latestOffer?.status === OfferToRequestStatusesEnum.CANCELED),
        [status, request.latestOffer],
    );

    const isDeclinedByCarrier = useMemo(
        () => status === RequestStatusesEnum.NEW && request.latestOffer?.status === OfferToRequestStatusesEnum.DECLINED,
        [status, request.latestOffer],
    );

    const isCanceledByCarrier = useMemo(() => status === RequestStatusesEnum.CANCELED, [status]);

    const isCanceledOffer = useMemo(
        () => status !== RequestStatusesEnum.DECLINED && request.latestOffer?.status === OfferToRequestStatusesEnum.CANCELED,
        [status, request.latestOffer?.status],
    );
    const isSentOffer = useMemo(
        () => status !== RequestStatusesEnum.DECLINED && request.latestOffer?.status === OfferToRequestStatusesEnum.NEW,
        [request.latestOffer?.status, status],
    );

    const orderTagTitle = useMemo(() => {
        if (isCanceledOffer) {
            return t('statuses:canceled', { companyType: translateCompanyType('shipper') });
        }

        if (isCanceledByCarrier) {
            return t('statuses:canceled', { companyType: translateCompanyType('carrier') });
        }
        if (isDeclinedByShipper) {
            return t('statuses:declined', { companyType: translateCompanyType('shipper') });
        }
        if (isDeclinedByCarrier) {
            return t('statuses:declined', { companyType: translateCompanyType('carrier') });
        }

        if (isSentOffer) {
            return t('statuses:offer-sent');
        }

        return t(`statuses:${toKebabCase(status)}`);
    }, [isCanceledOffer, isCanceledByCarrier, isDeclinedByCarrier, isDeclinedByShipper, isSentOffer, status]);

    const orderTagView = useMemo(() => {
        if (isCanceledOffer || isCanceledByCarrier) {
            return toKebabCase(OrderStatus.ON_HOLD);
        }

        if (isDeclinedByShipper || isDeclinedByCarrier) {
            return toKebabCase(OrderStatus.DECLINED);
        }

        if (isSentOffer) {
            return toKebabCase(OrderStatus.POSTED);
        }

        if (status === RequestStatusesEnum.READ) {
            return toKebabCase(OrderStatus.DELIVERED);
        }

        return toKebabCase(status);
    }, [isCanceledByCarrier, isCanceledOffer, isDeclinedByCarrier, isDeclinedByShipper, isSentOffer, status]);

    const header = useMemo(
        () => (
            <>
                <div className={cn('header-company-container')}>
                    <span className={cn('header-company-name')}>{carrierCompany.name}</span>
                    <span>
                        <OrderTag view={orderTagView}>{orderTagTitle}</OrderTag>
                    </span>
                </div>
                <span className={cn('created-at')}>{t('requested', { date: diffForHumans(new Date(createdAt)) })}</span>
            </>
        ),
        [carrierCompany.name, createdAt, orderTagTitle, orderTagView],
    );

    const totalLatestOfferPayment = useMemo(
        () => getFinalPaymentAmount(request.latestOffer?.paymentPrice, request.latestOffer?.delayedPayment, request.latestOffer?.brokerFee),
        [request.latestOffer],
    );

    const alertBlock = useMemo(
        () => (
            <>
                {isSentOffer && request.latestOffer && (
                    <AlertBlock view='warning'>
                        {t('offer-sent')}
                        <span className={cn('alert-price')}>{formatToCurrency(totalLatestOfferPayment)}</span>(
                        {diffForHumans(new Date(request.latestOffer.createdAt))})
                    </AlertBlock>
                )}
                {isDeclinedByShipper && (
                    <AlertBlock view='danger'>
                        {t('request-declined-by-shipper')} {request.declinedAt && `(${diffForHumans(new Date(request.declinedAt))})`}
                    </AlertBlock>
                )}
                {isDeclinedByCarrier && request.latestOffer && (
                    <AlertBlock view='danger'>
                        {t('offer-for')} <span className={cn('alert-price')}>{formatToCurrency(totalLatestOfferPayment)}</span>
                        {t('offer-declined')} {request.latestOffer.declinedAt && `(${diffForHumans(new Date(request.latestOffer.declinedAt))})`}
                    </AlertBlock>
                )}
                {isCanceledByCarrier && (
                    <AlertBlock view='canceled'>
                        {t('request-canceled-by-carrier')} {request.canceledAt && `(${diffForHumans(new Date(request.canceledAt))})`}
                    </AlertBlock>
                )}
                {isCanceledOffer && request.latestOffer && (
                    <AlertBlock view='canceled'>
                        {t('offer-for')}
                        <span className={cn('alert-price')}>{formatToCurrency(totalLatestOfferPayment)}</span>
                        {t('offer-canceled')} {request.latestOffer.canceledAt && `(${diffForHumans(new Date(request.latestOffer.canceledAt))})`}
                    </AlertBlock>
                )}
            </>
        ),
        [
            totalLatestOfferPayment,
            isSentOffer,
            request.latestOffer,
            request.declinedAt,
            request.canceledAt,
            isDeclinedByShipper,
            isDeclinedByCarrier,
            isCanceledByCarrier,
            isCanceledOffer,
        ],
    );

    const totalAmount = useMemo(() => calculateTotalPayment(order.paymentInformation), [order]);

    return (
        <Paper
            className={cn('', { sent: isSentOffer, declined: isDeclinedByShipper || isDeclinedByCarrier, canceled: isCanceledOffer || isCanceledByCarrier })}
            header={header}
            bodyClassName={cn('body', { hidden: !isBodyVisible })}
            body={
                <>
                    {alertBlock}
                    <div className={cn('row')}>
                        <div className={cn('column')}>
                            <div className={cn('block-title')}>{t('price')}</div>
                            <div className={cn('price-container')}>
                                <span className={cn('price')}>{formatToCurrency(paymentPrice)}</span>
                                {totalAmount > 0 && paymentPrice > totalAmount && (
                                    <OrderTag view='posted'>+{formatToCurrency(paymentPrice - totalAmount)}</OrderTag>
                                )}
                                {totalAmount > 0 && paymentPrice < totalAmount && (
                                    <OrderTag view='delivered'>{formatToCurrency(paymentPrice - totalAmount)}</OrderTag>
                                )}
                            </div>
                            <div className={cn('price-per-distance')}>{getPaymentPerDistance(paymentPrice, order.drivingDistance ?? 1)}</div>
                        </div>
                        <div className={cn('column')}>
                            <div className={cn('block-title')}>{t('dates')}</div>
                            <RequestDates
                                requestPickupDate={pickupAt}
                                requestDeliveryDate={deliveryAt}
                                orderDeliveryDate={order.deliveryInformation.scheduledDeliveryAt}
                                orderPickupDate={order.pickupInformation.scheduledPickupAt}
                            />
                        </div>
                    </div>
                    <div className={cn('column')}>
                        <div className={cn('block-title')}>{t('carrier')}</div>
                        <div className={cn('carrier-name')} onClick={handleShowCompanyPage}>
                            {carrierCompany.name}
                        </div>
                        <CompanyRatingWithReviewCount rating={carrierCompany?.rating} reviewsTotal={carrierCompany?.reviewsTotal} />
                        <div className={cn('carrier-container')}>
                            <div className={cn('carrier-owner')}>
                                <UserIcon /> {carrierCompany.owner.name}
                            </div>
                            <Ellipse width={4} height={4} />
                            <div className={cn('carrier-phone')}>{carrierCompany.phone}</div>
                        </div>
                    </div>
                    <div className={cn('column')}>
                        <div className={cn('block-title')}>{t('comment')}</div>
                        <div className={cn('comment')}>{comment}</div>
                    </div>
                </>
            }
            footerClassName={cn('footer')}
            footer={
                !hideButtons && (
                    <>
                        {((status === RequestStatusesEnum.NEW && !request.latestOffer) || isCanceledOffer) && (
                            <div className={cn('footer-btn-group')}>
                                <Button size='medium' view='primary' onClick={sendOffer}>
                                    {t('send-offer-btn')}
                                </Button>
                                <Button size='medium' onClick={declineRequestHandler}>
                                    {t('decline-btn')}
                                </Button>
                            </div>
                        )}
                        {isSentOffer && (
                            <Button size='medium' onClick={cancelOfferHandler}>
                                {t('cancel-offer-btn')}
                            </Button>
                        )}
                        {isDeclinedByShipper || isDeclinedByCarrier || isCanceledByCarrier ? (
                            <Button size='medium' onClick={toggleBodyVisibility}>
                                {isBodyVisible ? t('hide-btn') : t('show-details-btn')}
                            </Button>
                        ) : (
                            <MessageButton orderId={order.publicId} />
                        )}
                    </>
                )
            }
        />
    );
};
