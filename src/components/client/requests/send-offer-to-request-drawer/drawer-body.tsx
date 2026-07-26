import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { RequestOrderInfo } from '@/components/client/requests/requests-drawer/request-order-info';
import { getFinalPaymentAmount } from '@/utils/payment';
import { Button, OrderOfferDetails, Paper, RequestItem } from '@components';
import { FormControl, InputLabel, SwitchInput, TextField } from '@fields';
import { useCreateOfferMutation } from '@store/api/order-offers';
import { OrderRequest } from '@store/api/order-requests-api';
import { Load, SendOfferToCarrierFormState } from '@store/client';
import { classname, formatToCurrency, translateByNamespace } from '@utils';
import { required } from '@validators';

const requestForm = translateByNamespace('client:loadboard:request-form');
const requestT = translateByNamespace('client:requests-page:drawer:request-item');
const t = translateByNamespace('client:orders-page:send-offer-to-carrier:drawer');

const requestFormClasses = classname('request-form');

type DrawerBodyProps = {
    order: Load;
    request: OrderRequest;
    closeDrawer: () => void;
};

const cn = classname('requests-send-offer');

export const DrawerBody = ({ order, request, closeDrawer }: DrawerBodyProps) => {
    const initialValues = useMemo<SendOfferToCarrierFormState & { argeed: boolean; comment: string }>(() => {
        return {
            carrierDeliveryTypeDate: order?.deliveryInformation.deliveryDateType || '',
            carrierPickupTypeDate: order?.pickupInformation.pickupDateType || '',
            carrierPrice: order?.paymentInformation.payment || 0,
            carrierPickupAt: order?.pickupInformation.scheduledPickupAt || '',
            carrierDeliveryAt: order?.deliveryInformation.scheduledDeliveryAt || '',
            delayedPayment: order?.paymentInformation.delayedPayment,
            brokerFee: order?.paymentInformation.brokerFee,
            argeed: false,
            comment: '',
        };
    }, [order]);

    const [createOffer] = useCreateOfferMutation();
    const onSubmit = (values: SendOfferToCarrierFormState & { argeed: boolean; comment: string }) => {
        createOffer({
            orderId: order.publicId,
            carrierCompanyId: request.carrierCompany.publicId,
            orderRequestId: request.publicId,
            paymentPrice: values.carrierPrice,
            pickupDateType: values.carrierPickupTypeDate,
            deliveryDateType: values.carrierDeliveryTypeDate,
            pickupAt: values.carrierPickupAt,
            deliveryAt: values.carrierDeliveryAt,
            contactName: 'Noone',
            ...(values.brokerFee != null && { brokerFee: values.brokerFee ? values.brokerFee : 0 }),
            ...(values.delayedPayment != null && { delayedPayment: values.delayedPayment ? values.delayedPayment : 0 }),
        })
            .unwrap()
            .then(() => {
                toast.success(t<string>('offer-create-success'));
                closeDrawer();
            })
            .catch(e => {
                let message = t('offer-create-error');

                if (e.data.message) {
                    message = e.data.message as string;
                }
                toast.error(message);
                console.error(e);
            });
    };

    return (
        <>
            <RequestOrderInfo order={order} />
            <div className={cn('body')}>
                <RequestItem hideButtons={true} request={request} order={order} />

                <Paper
                    headerClassName={cn('form-title')}
                    header={requestForm('send-offer-title')}
                    body={
                        <Form<SendOfferToCarrierFormState & { argeed: boolean; comment: string }>
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={({ form, handleSubmit }) => {
                                const { carrierPrice, brokerFee, delayedPayment } = form.getState().values;
                                const totalAmount = getFinalPaymentAmount(Number(carrierPrice), Number(delayedPayment ?? 0), Number(brokerFee ?? 0));

                                return (
                                    <form className={cn('form')} onSubmit={handleSubmit}>
                                        <OrderOfferDetails
                                            hideDivider={true}
                                            terms={order?.paymentInformation.terms}
                                            delayedTerms={order?.paymentInformation.delayedTerms}
                                            method={order?.paymentInformation.method}
                                            delayedMethod={order?.paymentInformation.delayedMethod}
                                        />
                                        <FormControl>
                                            <InputLabel required={true}>{requestForm('comment')}</InputLabel>
                                            <Field name='comment' component={TextField} multiline={true} parse={value => value} validate={required} />
                                        </FormControl>
                                        <Field
                                            name='argeed'
                                            label={
                                                <div>
                                                    {requestForm('i-agree')} <span className={requestFormClasses('terms')}>{requestForm('terms')}</span>
                                                </div>
                                            }
                                            component={SwitchInput}
                                        />

                                        <Button type='submit' view='primary' className={requestFormClasses('btn')} disabled={!form.getState().values.argeed}>
                                            {requestT('send-offer-btn')} {totalAmount === 0 ? '' : formatToCurrency(totalAmount)}
                                        </Button>
                                    </form>
                                );
                            }}
                        />
                    }
                />
            </div>
        </>
    );
};
