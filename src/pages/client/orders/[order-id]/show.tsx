import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { MarkAsPickedUpPopup } from '@/components/client/orders/mark-as-picked-up-popup';
import { RestoreOrderPopup } from '@/components/client/orders/restore-order-popup';
import PageHead from '@/components/client/orders/show/header';
import { UnasignDriverPopup } from '@/components/client/orders/unasign-driver-popup';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { OrderSourcesEnum, OrderStatus } from '@/enums';
import { AttachmentsForm } from '@/components/client/orders/forms/attachments-form/attachments-form';
import { ContactFooterContextProvider } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { CreateEditOrderInternalNotePopup } from '@/components/client/orders/popups/create-edit-order-internal-note-popup/create-edit-order-internal-note-popup';
import { DeleteOrderPopup } from '@/components/client/orders/popups/delete-order-popup/delete-order-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { MarkAsDeliveredPopup } from '@/components/client/orders/popups/mark-as-delivered-popup/mark-as-delivered-popup';
import { MarkAsNewPopup } from '@/components/client/orders/mark-as-new-popup/mark-as-new-popup';
import { OrderActions } from '@/components/client/orders/order-actions/order-actions';
import { OrderActivityPaper } from '@/components/client/orders/papers/order-activity-paper/order-activity-paper';
import { OrderAdditionalDocumentsPaper } from '@/components/client/orders/papers/order-additional-documents-paper/order-additional-documents-paper';
import { OrderDetailsDrawer } from '@/components/client/orders/drawers/order-details-drawer/order-details-drawer';
import { OrderDetailsPaper } from '@/components/client/orders/papers/order-details-paper/order-details-paper';
import { OrderDriverPaymentFormDrawer } from '@/components/client/orders/drawers/order-driver-payment-form-drawer/order-driver-payment-form-drawer';
import { OrderDriverPaymentFormPaper } from '@/components/client/orders/papers/order-driver-payment-form-paper/order-driver-payment-form-paper';
import { OrderExpenses } from '@/components/client/orders/papers/order-expenses-paper/order-expenses';
import { OrderInformation } from '@/components/client/orders/show/order-information/order-information';
import { OrderInspectionsPaper } from '@/components/client/orders/show/order-inspections-paper/order-inspections-paper';
import { OrderInternalNotesPaper } from '@/components/client/orders/papers/order-internal-notes-paper/order-internal-notes-paper';
import { OrderMarkAsPaidDrawer } from '@/components/client/orders/drawers/order-mark-as-paid-drawer/order-mark-as-paid-drawer';
import { OrderPickupAndDeliveryPaper } from '@/components/client/orders/papers/order-pickup-and-delivery-paper/order-pickup-and-delivery-paper';
import { OrderReviewPaper } from '@/components/client/orders/papers/order-review-paper/order-review-paper';
import { OrderSendBOLDrawer } from '@/components/client/orders/drawers/order-send-bol-drawer/order-send-bol-drawer';
import { OrderSendInvoiceDrawer } from '@/components/client/orders/drawers/order-send-invoice-drawer/order-send-invoice-drawer';
import { RequestsDrawer } from '@/components/client/requests/requests-drawer/requests-drawer';
import { SendOfferToRequestDrawer } from '@/components/client/requests/send-offer-to-request-drawer/send-offer-to-request-drawer';
import { useIsPartnerCompany, useMeCarrier, useMeDriverRelated, useScrollTop } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetOrderQuery } from '@store/api/orders-api';
import { orderDeletedAtSelector, ordersActions, orderSourceSelector, orderStatusSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';
import { getProjectName } from '@utils/translate/get-project-name';

import './show.scss';

const t = translateByNamespace('client:order:show-page');
const cn = classname('show-order-page');

const ShowOrderPage = () => {
    const isPartner = useIsPartnerCompany();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const [isCleared, setIsCleared] = useState<boolean>(false);

    useEffect(() => {
        const clearData = async () => {
            await dispatch(ordersActions.clearOrder());
            setIsCleared(true);
        };

        clearData();
    }, [dispatch]);

    const { isError, error, isLoading } = useGetOrderQuery(orderId, { skip: !isCleared || !orderId });
    const meIsCarrier = useMeCarrier();
    const status = useAppSelector(orderStatusSelector);
    const source = useAppSelector(orderSourceSelector);
    const deletedAt = useAppSelector(orderDeletedAtSelector);

    const isDriver = useMeDriverRelated();

    useScrollTop('.main-layout__body');

    if (!isCleared) {
        return null;
    }

    const hasInspections = (meIsCarrier || isDriver) && !isFreightX;
    const hasInspectionAndExpenses = hasInspections || !isPartner;
    const isDisabledAttachmentsForm = !!deletedAt || isDriver;

    return (
        <ContactFooterContextProvider>
            {!isError && (
                <div className={cn('')}>
                    <Head>
                        <title>{t('title', { projectName: getProjectName() })}</title>
                    </Head>
                    <div className={cn('wrapper')}>
                        <OrderDriverPaymentFormPaper />
                        <OrderAdditionalDocumentsPaper />
                        {source === OrderSourcesEnum.USHIPPER && status === OrderStatus.DELIVERED && <OrderReviewPaper />}
                        <OrderInformation />
                        <OrderPickupAndDeliveryPaper isLoading={isLoading} />
                        <OrderDetailsPaper />

                        <div className={cn('column-wrapper', { freightx: isFreightX })}>
                            {hasInspectionAndExpenses && (
                                <div className={cn('column')}>
                                    {hasInspections && <OrderInspectionsPaper />}
                                    {!isPartner && <OrderExpenses />}
                                </div>
                            )}

                            <div className={cn('column', { freightx: isFreightX })}>
                                {isFreightX ? (
                                    <>
                                        <AttachmentsForm orderId={orderId} disabled={isDisabledAttachmentsForm} />
                                        <OrderInternalNotesPaper />
                                        {!isDriver && <OrderActivityPaper />}
                                    </>
                                ) : (
                                    <>
                                        <OrderInternalNotesPaper />
                                        <AttachmentsForm orderId={orderId} disabled={isDisabledAttachmentsForm} />
                                        {!isDriver && <OrderActivityPaper />}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <OrderMarkAsPaidDrawer />
                    <OrderSendInvoiceDrawer />
                    <UnasignDriverPopup />
                    <MarkAsNewPopup />
                    <MarkAsPickedUpPopup />
                    <MarkAsDeliveredPopup />
                    <DeleteOrderPopup />
                    <RestoreOrderPopup />
                    <OrderDetailsDrawer />
                    <OrderSendBOLDrawer />
                    <RequestsDrawer />
                    <SendOfferToRequestDrawer />
                    <CreateEditOrderInternalNotePopup />
                    <OrderDriverPaymentFormDrawer />
                </div>
            )}
            {isError && (error as any).status === 403 && <AccessForbiddenBlock />}
        </ContactFooterContextProvider>
    );
};

ShowOrderPage.getLayout = getMainLayout({
    head: <PageHead renderActionsComponent={order => <OrderActions order={order} context='header' />} />,
    permissions: [
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.view_any' },
        { scope: 'carrierOrders', functionality: 'carrier.orders.view_any' },
    ],
});

export default ShowOrderPage;
