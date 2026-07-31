import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { OrderOfferDetails } from '@/components/client/orders/forms/common/order-offer-details/order-offer-details';
import { OrderCarrierCompanyAssignItem } from '@/components/client/orders/order-carrier-company-assign-item';
import { Divider } from '@/components/common/divider/divider';
import { Drawer } from '@/components/common/drawer/drawer';
import { OrderStatus } from '@/enums';
import { TextField } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { Company, fetchCompaniesAction, fetchedCompaniesSelector } from '@store/admin';
import { companiesActions } from '@store/admin/companies/slice';
import { useCreateOfferMutation } from '@store/api/order-offers';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { ordersActions, orderSendOfferToCarrierPropsSelector, SendOfferToCarrierFormState } from '@store/client';
import { List } from '@ui';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import './order-send-offer-to-carrier-drawer.scss';

const t = translateByNamespace('client:orders-page:send-offer-to-carrier:drawer');
const cn = classname('order-send-offer-to-carrier-drawer');

type SearchForm = {
    name?: string;
};

export const OrderSendOfferToCarrierDrawer = () => {
    const dispatch = useAppDispatch();
    const { orderId, order, isVisible, requestId } = useAppSelector(orderSendOfferToCarrierPropsSelector);

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setOrderSendOfferToCarrierDrawerProps({
                isVisible: false,
                orderId: null,
            }),
        );
    }, [dispatch]);
    const formRef = useRef<FormApi<SendOfferToCarrierFormState>>();

    const [updateOrder] = usePartiallyUpdateOrderMutation();
    const [createOffer] = useCreateOfferMutation();
    const onCompanySelectHandler = useCallback(
        (selectedCarrierCompanyId: string) => {
            if (formRef.current) {
                formRef.current.submit();
                if (formRef.current.getState().invalid) {
                    const container = document.querySelector('.order-send-offer-to-carrier-drawer')?.parentNode as Element;

                    if (container) {
                        container.scrollTop = 0;
                    }
                } else {
                    const formValues = formRef.current.getState().values;

                    if (!orderId) {
                        return;
                    }

                    createOffer({
                        orderId: orderId,
                        carrierCompanyId: selectedCarrierCompanyId,
                        orderRequestId: requestId,
                        paymentPrice: formValues.carrierPrice,
                        pickupDateType: formValues.carrierPickupTypeDate,
                        deliveryDateType: formValues.carrierDeliveryTypeDate,
                        pickupAt: formValues.carrierPickupAt,
                        deliveryAt: formValues.carrierDeliveryAt,
                        contactName: 'Noone',
                        ...(formValues.brokerFee != null && { brokerFee: formValues.brokerFee ? formValues.brokerFee : 0 }),
                        ...(formValues.delayedPayment != null && { delayedPayment: formValues.delayedPayment ? formValues.delayedPayment : 0 }),
                    })
                        .unwrap()
                        .then(() => {
                            toast.success(t<string>('offer-create-success'));

                            updateOrder({
                                publicOrderId: orderId,
                                newOrderData: {
                                    status: OrderStatus.PENDING,
                                },
                            });
                            handleClose();
                        })
                        .catch(e => {
                            let message = t('offer-create-error');

                            if (e.data.message) {
                                message = e.data.message as string;
                            }
                            toast.error(message);
                            console.error(e);
                        });
                }
            }
        },
        [updateOrder, createOffer, handleClose, orderId, requestId],
    );

    const [companySearchInputValue, setCompanySearchInputValue] = useState<string | undefined>('');

    useEffect(() => {
        if (isVisible) {
            dispatch(companiesActions.setFilters({ type: 'carrier', searchQuery: companySearchInputValue, searchSubjects: ['name', 'usdot_number'] }));
            dispatch(fetchCompaniesAction());
        }
    }, [dispatch, companySearchInputValue, isVisible]);

    const fetchedCompanies = useAppSelector(fetchedCompaniesSelector);

    const initialValues: SendOfferToCarrierFormState = useMemo(() => {
        return {
            carrierDeliveryTypeDate: order?.deliveryInformation.deliveryDateType || '',
            carrierPickupTypeDate: order?.pickupInformation.pickupDateType || '',
            carrierPrice: order?.paymentInformation.payment || 0,
            delayedPayment: order?.paymentInformation.delayedPayment,
            brokerFee: order?.paymentInformation.brokerFee,
            carrierPickupAt: order?.pickupInformation.scheduledPickupAt || '',
            carrierDeliveryAt: order?.deliveryInformation.scheduledDeliveryAt || '',
        };
    }, [order]);

    const body = useMemo(
        () => (
            <>
                <Form<SendOfferToCarrierFormState>
                    onSubmit={() => {
                        console.log(2);
                    }}
                    initialValues={initialValues}
                    render={({ form }) => {
                        formRef.current = form;

                        return (
                            <form>
                                <OrderOfferDetails
                                    terms={order?.paymentInformation.terms}
                                    delayedTerms={order?.paymentInformation.delayedTerms}
                                    method={order?.paymentInformation.method}
                                    delayedMethod={order?.paymentInformation.delayedMethod}
                                />
                            </form>
                        );
                    }}
                />
                <Divider>{t('search-carrier-divider')}</Divider>
                <Form<SearchForm>
                    subscription={{ values: true }}
                    onSubmit={values => setCompanySearchInputValue(values.name)}
                    render={({ handleSubmit }) => (
                        <form>
                            <FormValuesSpy onChange={handleSubmit} debounceTime={300} />
                            <Field name='name' component={TextField} placeholder={t('search-placeholder')} />
                        </form>
                    )}
                />
                <List<Company>
                    className={cn('company-list')}
                    data={fetchedCompanies}
                    renderItem={({ item }) => (
                        <OrderCarrierCompanyAssignItem
                            key={item.publicId}
                            company={item}
                            onClick={() => onCompanySelectHandler(item.publicId)}
                            disabled={false}
                            buttonLabel={t('send-offer')}
                        />
                    )}
                    ListEmptyComponent={<div className={cn('not-found-message')}>{t('not-found-message')}</div>}
                />
            </>
        ),
        [
            initialValues,
            fetchedCompanies,
            order?.paymentInformation.terms,
            order?.paymentInformation.delayedTerms,
            order?.paymentInformation.method,
            order?.paymentInformation.delayedMethod,
            onCompanySelectHandler,
        ],
    );

    return <Drawer onTop={!!requestId} isOpen={isVisible} onClose={handleClose} head={t('header')} body={body} bodyClassName={cn()} />;
};
