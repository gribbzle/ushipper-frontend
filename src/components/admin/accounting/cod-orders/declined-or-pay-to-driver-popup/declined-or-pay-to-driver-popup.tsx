import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button, Popup } from '@/components/common';
import { FormControl, InputLabel, TextField } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, declineOrPayToDriverPopupPropsSelector } from '@store/admin';
import { ordersApi, useUpdateOrderMutation } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isOrderCheckCompanyPaid } from '@utils/orders/order-payment-helpers';
import { translateDriverPayoutStatusError, translateDriverPayoutStatusSuccess } from '@utils/translate/accounting/notification-translations';
import { required } from '@validators';

import './declined-or-pay-to-driver-popup.scss';

type DeclineReasonFormState = {
    instantTermPaymentDeclineReason: string;
};

const t = translateByNamespace('admin:accounting:cod-orders:declined-or-pay-to-driver-popup');
const cn = classname('declined-or-pay-to-driver-popup');

export const DeclineOrPayToDriverPopup = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<DeclineReasonFormState>>();

    const [updateOrder, { isLoading }] = useUpdateOrderMutation();

    const onClosePopupHandler = useCallback(() => {
        dispatch(
            accountingActions.setDeclineOrPayToDriverPopupProps({
                isPopupOpened: false,
                orderPublicId: null,
                driverName: null,
                driverPay: null,
                instantTermPaymentType: null,
            }),
        );
    }, [dispatch]);

    const { isPopupOpened, orderPublicId, driverName, driverPay, instantTermPaymentType } = useAppSelector(declineOrPayToDriverPopupPropsSelector);

    const isPayToDriver = useMemo(() => isOrderCheckCompanyPaid(instantTermPaymentType), [instantTermPaymentType]);

    const onPayToDriverClickHandler = useCallback(async () => {
        if (orderPublicId && instantTermPaymentType) {
            try {
                const instantTermPaymentDeclineReason = formRef.current?.getState().values?.instantTermPaymentDeclineReason || null;

                await updateOrder({
                    instantTermPaymentType,
                    publicId: orderPublicId,
                    ...(instantTermPaymentDeclineReason ? { instantTermPaymentDeclineReason } : {}),
                }).unwrap();

                dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }]));

                onClosePopupHandler();

                toast.success(translateDriverPayoutStatusSuccess(isPayToDriver));
            } catch (error) {
                toast.error(translateDriverPayoutStatusError(isPayToDriver));
            }
        }
    }, [orderPublicId, instantTermPaymentType, isPayToDriver, updateOrder, onClosePopupHandler, dispatch]);

    const actions = useMemo(
        () => (
            <>
                <Button disabled={isLoading} size='small' view={isPayToDriver ? 'primary' : 'danger'} onClick={onPayToDriverClickHandler}>
                    {t(isPayToDriver ? 'pay' : 'decline')}
                </Button>
                <Button size='small' onClick={onClosePopupHandler}>
                    {t(isPayToDriver ? 'cancel' : 'close')}
                </Button>
            </>
        ),
        [onPayToDriverClickHandler, onClosePopupHandler, isLoading, isPayToDriver],
    );

    const description = useMemo(() => {
        if (isPayToDriver) {
            return null;
        }

        return (
            <Form<DeclineReasonFormState>
                initialValues={{}}
                onSubmit={() => undefined}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <InputLabel required={true}>{t('decline-reason-label')}</InputLabel>
                                <Field
                                    name='instantTermPaymentDeclineReason'
                                    component={TextField}
                                    multiline={true}
                                    resize='none'
                                    validate={required}
                                    parse={value => value}
                                    placeholder=''
                                />
                            </FormControl>
                        </form>
                    );
                }}
            />
        );
    }, [isPayToDriver, formRef]);

    return (
        <Popup
            isOpen={isPopupOpened}
            onClose={onClosePopupHandler}
            title={t(`${isPayToDriver ? 'pay' : 'decline'}-title`, { driverName: driverName ?? '', driverPay: driverPay ?? '' })}
            actions={actions}
            description={description}
            size='medium'
            className={cn('', { pay: isPayToDriver })}
        />
    );
};
