import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import cleanDeep from 'clean-deep';
import arrayMutators from 'final-form-arrays';
import has from 'has-values';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { CreateEditContactDrawer } from '@/components/client/contacts/creat-edit-contact-drawer/create-edit-contacts-drawer';
import { AttachmentsForm } from '@/components/client/orders/forms/attachments-form/attachments-form';
import { ContactFooterContextProvider } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { OrderCustomerInformationFieldsGroup } from '@/components/client/orders/forms/order-customer-information-fields-group/order-customer-information-fields-group';
import { OrderDeliveryInformationFieldsGroup } from '@/components/client/orders/forms/order-delivery-information-form/order-delivery-information-fields-group';
import { OrderDetailsFieldsGroup } from '@/components/client/orders/forms/order-details-fields-group/order-details-fields-group';
import { OrderPaymentInformationFieldsGroup } from '@/components/client/orders/forms/order-payment-information-fields-group/order-payment-information-fields-group';
import { OrderPickupInformationFieldsGroup } from '@/components/client/orders/forms/order-pickup-information-fields-group/order-pickup-information-fields-group';
import { OrderCommoditiesFormPaper } from '@/components/client/orders/papers/order-commodities-form-paper/order-commodities-form-paper';
import { OrderExpensesFormPaper } from '@/components/client/orders/papers/order-expenses-form-paper/order-expenses-form-paper';
import { OrderVehiclesFormPaper } from '@/components/client/orders/papers/order-vehicles-form-paper/order-vehicles-form-paper';
import { RouterContext } from '@/components/common/router-provider/router-provider';
import { Paper } from '@/components/common/paper/paper';
import { useRedirectToOrder } from '@/hooks/order';
import { useOnBack } from '@/hooks/useOnBack';
import { Attachment } from '@/shared';
import { AttachmentType } from '@/enums/attachment-types-enum';
import { CommodityDimensionUnitEnum } from '@/enums/commodity/commodity-dimension-unit-enum';
import { CommodityTemperatureUnitEnum } from '@/enums/commodity/commodity-temperature-unit-enum';
import { CommodityWeightUnitEnum } from '@/enums/commodity/commodity-weight-unit-enum';
import { DelayedPaymentTerm } from '@/enums/payment-term';
import { ExpenseTypeEnum } from '@/enums/expense-type-enum';
import { InspectionType } from '@/enums/inspection-type';
import { OrderPaymentStatus } from '@/enums/order-payment-status';
import { VehicleType } from '@/enums/vehicle-type';
import { useMeCarrier } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { useUpdateOrderPaymentMutation } from '@store/api/order-payment-api';
import { ordersApi, useCreateOrderAttachmentMutation, useCreateOrderMutation, useUpdateOrderMutation } from '@store/api/orders-api';
import { isCreateEditContactModalVisibleSelector, OrderFormEnum, OrderFormState, OrderPaymentInformation } from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { preparePaymentInformation } from '@utils/orders/prepare-payment-information';
import { isFreightX } from '@utils/project-config';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';
import { scrollToFirstErrorField } from '@utils/scroll-to-error-filed';

import { getDifferences, prepareCommodities, prepareExpenses, prepareVehicles } from './utils';

import './order-general-form.scss';

const cn = classname('order-general-form');
const t = translateByNamespace('client:order');

type Props = {
    initialValues?: OrderFormState;
    isFulled?: boolean;
};

export const OrderGeneralForm = ({ initialValues, isFulled = false }: Props) => {
    const [createOrder] = useCreateOrderMutation();
    const [updateOrder] = useUpdateOrderMutation();
    const [updatePayment] = useUpdateOrderPaymentMutation();
    const [createAttachments] = useCreateOrderAttachmentMutation();

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { prevRouter } = useContext(RouterContext);
    const isCreateEditContactModalVisible = useAppSelector(isCreateEditContactModalVisibleSelector);
    const [initValue, setInitValue] = useState<OrderFormState>({});
    const isMeCarrier = useMeCarrier();

    useEffect(() => {
        setInitValue(initialValues || {});
    }, [initialValues]);

    const submitWithRedirect = useRef(false);
    const { redirectToOrders } = useRedirectToOrder({});
    const onBackHandler = useOnBack(redirectToOrders);

    const handleSubmit = useCallback(
        async (values: OrderFormState) => {
            const ordersPath = '/client/orders';
            const asOrdersPath = '/orders';

            if (values.publicId) {
                const dirtyValues = getDifferences<OrderFormState>(values, initValue);

                const orderValues = {
                    ...dirtyValues,
                    expenses: prepareExpenses(values.expenses),
                    vehicles: prepareVehicles(values.vehicles),
                    commodities: prepareCommodities(values.commodities),
                    ...(values.deletedVehicles ? { deletedVehicles: values.deletedVehicles } : {}),
                    ...(values.deletedExpenses ? { deletedExpenses: values.deletedExpenses } : {}),
                    ...(values.deletedCommodities ? { deletedCommodities: values.deletedCommodities } : {}),

                    ...(values.paymentInformation ? { paymentInformation: preparePaymentInformation(values.paymentInformation) } : {}),
                };

                const { payment, ...rest } = orderValues;

                try {
                    if (payment && orderValues.paymentStatus === OrderPaymentStatus.PAID) {
                        await updatePayment(cleanDeep({ ...payment, orderId: values.publicId })).unwrap();
                    }

                    await updateOrder({ ...rest, publicId: values.publicId }).unwrap();
                    toast.success(t<string>('notifications.updated'));
                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: values.publicId }]));

                    if (prevRouter?.asPath === `${asOrdersPath}/${rest.publicId}`) {
                        await router.push(
                            {
                                pathname: `${ordersPath}/[order-id]`,
                                query: {
                                    ['order-id']: rest.publicId,
                                },
                            },
                            `${asOrdersPath}/${rest.publicId}`,
                        );
                    } else {
                        await router.push(ordersPath, `${asOrdersPath}`);
                    }
                } catch {
                    toast.error(t<string>('notifications.update-error'));
                    setInitValue(values);
                }
            } else {
                try {
                    const orderValues = {
                        ...values,
                        expenses: prepareExpenses(values.expenses),
                        vehicles: prepareVehicles(values.vehicles),
                        commodities: prepareCommodities(values.commodities),
                        ...(values.paymentInformation ? { paymentInformation: preparePaymentInformation(values.paymentInformation) } : {}),
                    };

                    const { attachments, cdContract, bolAttachments, podAttachments, ...otherOrderValues } = orderValues;
                    const order = await createOrder(otherOrderValues).unwrap();

                    const handleUploadAttachments = async (files: File[], type?: AttachmentType) => {
                        const promises: Array<Promise<Attachment>> = [];

                        files.forEach(file => {
                            promises.push(
                                createAttachments({
                                    orderId: order.publicId,
                                    file: file,
                                    ...(type && { type }),
                                }).unwrap(),
                            );
                        });

                        await Promise.all(promises);
                    };

                    if (attachments) {
                        await handleUploadAttachments(attachments);
                    }

                    if (cdContract) {
                        await handleUploadAttachments(cdContract, AttachmentType.CD_CONTRACT);
                    }

                    if (bolAttachments) {
                        await handleUploadAttachments(bolAttachments, AttachmentType.BOL);
                    }

                    if (podAttachments) {
                        await handleUploadAttachments(podAttachments, AttachmentType.POD);
                    }
                    toast.success(t<string>('notifications.created'));

                    if (submitWithRedirect.current) {
                        await onBackHandler();
                    } else {
                        await router.push(
                            {
                                pathname: `${ordersPath}/[order-id]/edit`,
                                query: {
                                    ['order-id']: order.publicId,
                                },
                            },
                            `${asOrdersPath}/${order.publicId}/edit`,
                        );
                    }
                } catch {
                    toast.error(t<string>('notifications.create-error'));
                    setInitValue(values);
                }
            }
        },
        [updatePayment, updateOrder, dispatch, prevRouter?.asPath, router, initValue, createOrder, createAttachments, onBackHandler],
    );

    const onModalCloseHandler = useCallback(() => {
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: false, mode: null, contactId: null }));
    }, [dispatch]);

    const preparedInitialValues = useMemo<OrderFormState>(() => {
        if (!initValue.vehicles?.length) {
            Object.assign(initValue, { vehicles: [{ type: VehicleType.OTHER }] });
        }

        if (!initValue.expenses?.length) {
            Object.assign(initValue, { expenses: [{ type: ExpenseTypeEnum.OTHER }] });
        }

        if (!initValue.commodities?.length) {
            Object.assign(initValue, {
                commodities: [
                    {
                        weightUnit: CommodityWeightUnitEnum.POUNDS,
                        temperatureUnit: CommodityTemperatureUnitEnum.FAHRENHEIT,
                        dimensionUnit: CommodityDimensionUnitEnum.INCHES,
                    },
                ],
            });
        }

        const paymentInformation: Partial<OrderPaymentInformation> = {};

        if (!initValue.publicId && isFreightX) {
            Object.assign(paymentInformation, {
                delayedTerms: DelayedPaymentTerm.BUSINESS_DAYS_30,
            });
        }

        if (initValue.paymentInformation?.terms) {
            Object.assign(paymentInformation, initValue.paymentInformation);
        } else {
            const { payment: _payment, terms: _terms, method: _method, ...rest } = initValue.paymentInformation || {};

            Object.assign(paymentInformation, rest);
        }

        return {
            ...initValue,
            details: {
                ...(initValue.details || { inspectionType: InspectionType.ADVANCED }),
            },
            deliveryInformation: {
                ...initValue.deliveryInformation,
                createNewContact: false,
            },
            pickupInformation: {
                ...initValue.pickupInformation,
                createNewContact: false,
            },
            customerInformation: {
                ...(initValue.customerInformation || { createNewContact: false }),
            },
            paymentInformation,
        };
    }, [initValue]);

    const formComponent = useMemo(
        () => (
            <ContactFooterContextProvider>
                <Paper className={cn('details-paper')} title={t('details.header')} body={<OrderDetailsFieldsGroup />} />
                <Paper className={cn('pickup-information-paper')} title={t('pickup-information.header')} body={<OrderPickupInformationFieldsGroup />} />
                <Paper className={cn('delivery-information-paper')} title={t('delivery-information.header')} body={<OrderDeliveryInformationFieldsGroup />} />
                {renderProjectSpecificComponent(
                    {
                        OrderVehiclesFormPaper: (
                            <OrderVehiclesFormPaper className={cn('vehicles-paper')} counterVehicles={preparedInitialValues?.vehicles?.length} />
                        ),
                        OrderCommoditiesFormPaper: (
                            <OrderCommoditiesFormPaper className={cn('commodities-paper')} counterCommodities={preparedInitialValues?.commodities?.length} />
                        ),
                    },
                    'orderProductsFormPaper',
                )}
                <Paper
                    className={cn('customer-information-paper')}
                    title={isMeCarrier ? t('customer-information.broker-header') : t('customer-information.header')}
                    body={<OrderCustomerInformationFieldsGroup />}
                />
                <Paper className={cn('payment-information-paper')} title={t('payment-information.header')} body={<OrderPaymentInformationFieldsGroup />} />
                <AttachmentsForm orderId={initialValues?.publicId || null} />
                {isFulled && <OrderExpensesFormPaper className={cn('expenses-paper')} counterExpenses={preparedInitialValues?.expenses?.length} />}
            </ContactFooterContextProvider>
        ),
        [
            preparedInitialValues?.vehicles?.length,
            preparedInitialValues?.commodities?.length,
            preparedInitialValues?.expenses?.length,
            isMeCarrier,
            initialValues?.publicId,
            isFulled,
        ],
    );

    return (
        <>
            <Form<OrderFormState>
                onSubmit={handleSubmit}
                initialValues={preparedInitialValues}
                validateOnBlur={true}
                mutators={{
                    ...arrayMutators,
                }}
                render={({ handleSubmit, form }) => {
                    const handleButtonClick = () => {
                        form.submit();
                        const errors = form.getState().errors;

                        if (has(errors)) {
                            scrollToFirstErrorField();
                        }
                    };

                    return (
                        <form onSubmit={handleSubmit} className={cn('', { freightx: isFreightX })} autoComplete='off'>
                            {formComponent}
                            <button
                                hidden={true}
                                id={OrderFormEnum.GENERAL}
                                onClick={() => {
                                    submitWithRedirect.current = false;
                                    handleButtonClick();
                                }}
                            />
                            <button
                                hidden={true}
                                id={OrderFormEnum.GENERAL_WITH_REDIRECT}
                                onClick={() => {
                                    submitWithRedirect.current = true;
                                    handleButtonClick();
                                }}
                            />
                        </form>
                    );
                }}
            />
            <CreateEditContactDrawer isOpen={isCreateEditContactModalVisible} onClose={onModalCloseHandler} pageId='contacts' />
        </>
    );
};
