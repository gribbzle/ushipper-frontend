import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { CustomCheckContractError } from '@/components/common/parsed-order-actions/use-handle-check-contract';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { OfferStatusesEnum, OrderSourcesEnum } from '@/enums';
import { RequestStatusesEnum } from '@/enums/request-statuses';
import { calculateTotalPayment, getPaymentPerDistance } from '@/utils/payment';
import { CurrencyInput, DatePicker, FormControl, InputLabel, SwitchInput, TextField } from '@fields';
import { useMeCarrier, useParsedOrderSettingsError } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import loadboardApi from '@store/api/loadboard-api';
import { OrderOffer } from '@store/api/order-offers';
import { useCreateRequestMutation, usePartiallyUpdateRequestMutation } from '@store/api/order-requests-api';
import { Load } from '@store/client';
import { authorizedUserNameSelector } from '@store/global';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { required } from '@validators';

import './request-form.scss';

const cn = classname('request-form');
const bodyCn = classname('loadboard-request-body');
const t = translateByNamespace('client:loadboard:request-form');
const loadBoardItem = translateByNamespace('client:loadboard:item');
const loadboardItemTransate = translateByNamespace('client:loadboard:item');
const tTitle = translateByNamespace('client:loadboard:checking-contract-popup');

type FormState = {
    paymentPrice: string;
    pickupAt: string;
    deliveryAt: string;
    comment: string;
    argeed: boolean;
    contactName: string;
};

type Props = {
    order: Load;
    callback: () => void;
};

export const RequestForm = ({ order, callback }: Props) => {
    const dispatch = useAppDispatch();
    const [createRequest] = useCreateRequestMutation();
    const [updateRequest] = usePartiallyUpdateRequestMutation();
    const userName = useAppSelector(authorizedUserNameSelector);

    const request = useMemo(() => order.latestRequest, [order.latestRequest]);

    const isSent = useMemo(() => Boolean(request) && request?.status !== RequestStatusesEnum.CANCELED, [request]);

    const { latestOffer, carrierOrder, source, publicId } = order;

    const isParsedOrder = source !== OrderSourcesEnum.USHIPPER;
    const parsedOrderSettingsError = useParsedOrderSettingsError({ publicOrderId: publicId, popupTitle: tTitle('send-request-title') });

    const onSubmit = useCallback(
        (values: FormState) => {
            const { comment, paymentPrice, pickupAt, deliveryAt, contactName } = values;

            createRequest({
                orderId: publicId,
                data: {
                    paymentPrice: parseFloat(paymentPrice),
                    pickupAt,
                    deliveryAt,
                    ...(isParsedOrder ? { contactName } : { comment }),
                },
            })
                .unwrap()
                .then(() => {
                    toast.success(t<string>('success'));
                    dispatch(
                        loadboardApi.util.invalidateTags([
                            { type: 'Loadboard', id: 'LIST' },
                            { type: 'Loadboard', id: 'Statistic' },
                        ]),
                    );
                    callback();
                })
                .catch(err => {
                    const error = err as CustomCheckContractError;
                    const { status, data } = error;

                    if (/^4\d{2}$/.test(status.toString()) && isParsedOrder) {
                        parsedOrderSettingsError({ error: data.message, defaultMessage: t('parsed-order-error') });

                        return;
                    }

                    toast.error<string>(t('error'));
                });
        },
        [callback, createRequest, dispatch, isParsedOrder, parsedOrderSettingsError, publicId],
    );

    const formRef = useRef<FormApi<FormState>>();

    const handleRequestDelete = useCallback(
        () =>
            updateRequest({
                publicOrderId: publicId,
                publicRequestId: request?.publicId as string,
                data: {
                    status: RequestStatusesEnum.CANCELED,
                },
            }).then(() => {
                toast.success<string>(t('request-canceled-success-notification'));
                dispatch(
                    loadboardApi.util.invalidateTags([
                        { type: 'Loadboard', id: 'LIST' },
                        { type: 'Loadboard', id: 'Statistic' },
                    ]),
                );
                callback();
            }),
        [callback, request?.publicId, publicId, dispatch, updateRequest],
    );

    const isBooked = useMemo(() => latestOffer?.status === OfferStatusesEnum.ACCEPTED, [latestOffer?.status]);
    const isOfferReceived = useMemo(() => latestOffer?.status === OfferStatusesEnum.NEW, [latestOffer?.status]);
    const isDeclined = useMemo(() => request?.status === RequestStatusesEnum.DECLINED, [request?.status]);

    const router = useRouter();

    const handleViewOrder = useCallback(
        (orderId: string) => {
            router.push(`orders/${orderId}`);
        },
        [router],
    );

    const handleViewOffer = useCallback(
        async (offer: OrderOffer) => {
            await router.push({
                query: {
                    drawerOfferId: offer.publicId,
                    drawerTab: OfferTabsEnum.details,
                },
            });
        },
        [router],
    );

    const isMeCarrier = useMeCarrier();
    const totalAmount = useMemo(() => (order ? calculateTotalPayment(order.paymentInformation) : ''), [order]);

    const shouldShowCommentAgreeFields = useMemo(() => {
        return (!isParsedOrder && !isBooked && !isOfferReceived) || (isOfferReceived && request?.status === RequestStatusesEnum.CANCELED);
    }, [isParsedOrder, isBooked, isOfferReceived, request?.status]);

    return (
        <Paper
            headerClassName={cn('header')}
            className={cn('', { sent: isSent && !isOfferReceived, booked: isBooked })}
            bodyClassName={cn('details')}
            header={<div className={bodyCn('card-title')}>{t('title')}</div>}
            body={
                <Form<FormState>
                    initialValues={{
                        paymentPrice: request?.paymentPrice?.toString() || totalAmount.toString(),
                        pickupAt: request?.pickupAt || order.pickupInformation.scheduledPickupAt || undefined,
                        deliveryAt: request?.deliveryAt || order.deliveryInformation.scheduledDeliveryAt || undefined,
                        comment: request?.comment || '',
                        contactName: userName,
                    }}
                    validateOnBlur={true}
                    subscription={{
                        values: true,
                    }}
                    onSubmit={onSubmit}
                    // eslint-disable-next-line complexity
                    render={({ form, handleSubmit }) => {
                        formRef.current = form;
                        const paymentPrice = form.getState().values.paymentPrice;

                        return (
                            <form className={cn()} onSubmit={handleSubmit}>
                                {isBooked && (
                                    <AlertBlock view='success'>
                                        <span>
                                            {loadBoardItem('order-was-booked', {
                                                time: latestOffer?.acceptedAt ? diffForHumans(new Date(latestOffer.acceptedAt)) : '',
                                            })}
                                        </span>
                                    </AlertBlock>
                                )}
                                {isOfferReceived && latestOffer && (
                                    <AlertBlock>
                                        {loadBoardItem('offer-received', {
                                            price: formatToCurrency(latestOffer.paymentPrice),
                                        })}
                                        {latestOffer.createdAt && <span className={cn('sent-ago')}>({diffForHumans(new Date(latestOffer.createdAt))})</span>}
                                    </AlertBlock>
                                )}
                                {request?.status === RequestStatusesEnum.NEW && !latestOffer && (
                                    <AlertBlock view='warning'>
                                        <>
                                            {loadBoardItem('request-sent', { price: '' })}
                                            <span className={cn('payment-price')}>{formatToCurrency(request.paymentPrice)}</span>
                                            {request?.createdAt && <span className={cn('sent-ago')}>({diffForHumans(new Date(request?.createdAt))})</span>}
                                        </>
                                    </AlertBlock>
                                )}
                                {request?.status === RequestStatusesEnum.CANCELED && (
                                    <AlertBlock view='canceled'>
                                        <>
                                            {loadBoardItem('request-for-canceled')}
                                            <span className={cn('payment-price')}>{formatToCurrency(request.paymentPrice)}</span>
                                            {request?.canceledAt && <span className={cn('sent-ago')}>({diffForHumans(new Date(request?.canceledAt))})</span>}
                                        </>
                                    </AlertBlock>
                                )}
                                {isDeclined && request && (
                                    <AlertBlock view='danger'>
                                        <>
                                            {loadBoardItem('request-declined', {
                                                price: formatToCurrency(request.paymentPrice),
                                            })}
                                            {request?.createdAt && <span className={cn('sent-ago')}>({diffForHumans(new Date(request?.createdAt))})</span>}
                                        </>
                                    </AlertBlock>
                                )}

                                <div className={cn('inputs-wrap', { reverse: isParsedOrder })}>
                                    {isParsedOrder && (
                                        <FormControl className='contact-name'>
                                            <InputLabel required={true}>{t('contact-name')}</InputLabel>
                                            <Field
                                                name='contactName'
                                                component={TextField}
                                                parse={value => value}
                                                validate={required}
                                                disabled={isBooked || isSent}
                                                placeholder=''
                                            />
                                        </FormControl>
                                    )}
                                    <FormControl className='payment-price'>
                                        <InputLabel required={true}>{t('price')}</InputLabel>
                                        <Field
                                            name='paymentPrice'
                                            component={CurrencyInput}
                                            validate={required}
                                            disabled={isBooked || isSent}
                                            startAdornment='$'
                                            hint={getPaymentPerDistance(paymentPrice ? parseFloat(paymentPrice) : 0, order.drivingDistance)}
                                        />
                                    </FormControl>
                                    <FormControl className='pickup-date'>
                                        <InputLabel required={true}>{t('pickup-date')}</InputLabel>
                                        <Field name='pickupAt' component={DatePicker} validate={required} disabled={isBooked || isSent} />
                                    </FormControl>
                                    <FormControl className='delivery-date'>
                                        <InputLabel required={true}>{t('delivery-date')}</InputLabel>
                                        <Field name='deliveryAt' component={DatePicker} validate={required} disabled={isBooked || isSent} />
                                    </FormControl>
                                </div>
                                {shouldShowCommentAgreeFields && (
                                    <>
                                        <FormControl>
                                            <InputLabel required={true}>{t('comment')}</InputLabel>
                                            <Field
                                                name='comment'
                                                component={TextField}
                                                multiline={true}
                                                parse={value => value}
                                                validate={required}
                                                disabled={isSent}
                                            />
                                        </FormControl>
                                        {!isDeclined && !isBooked && !isSent && (
                                            <Field
                                                name='argeed'
                                                label={
                                                    <div>
                                                        {t('i-agree')} <span className={cn('terms')}>{t('terms')}</span>
                                                    </div>
                                                }
                                                component={SwitchInput}
                                                disabled={isSent}
                                            />
                                        )}
                                    </>
                                )}
                                {/* {isParsedOrder && (
                                    <FormControl>
                                        <InputLabel required={true}>{t('contact-name')}</InputLabel>
                                        <Field
                                            name='contactName'
                                            component={TextField}
                                            parse={value => value}
                                            validate={required}
                                            disabled={isBooked || isSent}
                                            placeholder=''
                                        />
                                    </FormControl>
                                )} */}

                                {isBooked && carrierOrder?.publicId ? (
                                    <Button view='primary' className={cn('btn')} onClick={() => handleViewOrder(carrierOrder.publicId)}>
                                        {loadBoardItem('view-order')}
                                    </Button>
                                ) : (
                                    latestOffer &&
                                    isOfferReceived && (
                                        <Button view='primary' className={cn('btn')} onClick={() => handleViewOffer(latestOffer)}>
                                            {loadBoardItem('view-offer')}
                                        </Button>
                                    )
                                )}
                                {isMeCarrier && (
                                    <>
                                        {!isSent && !isBooked && (
                                            <Button
                                                type='submit'
                                                view='primary'
                                                className={cn('btn')}
                                                disabled={
                                                    !(!request || (request && request.status === RequestStatusesEnum.CANCELED)) ||
                                                    (!isParsedOrder && !form.getState().values.argeed)
                                                }
                                            >
                                                {loadboardItemTransate('send-request')} {paymentPrice ? formatToCurrency(parseFloat(paymentPrice)) : ''}
                                            </Button>
                                        )}
                                        {isSent && !isBooked && request?.status !== RequestStatusesEnum.DECLINED && (
                                            <Button view='danger' className={cn('btn')} onClick={handleRequestDelete}>
                                                {t('cancel-request-btn')}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
