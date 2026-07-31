import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { MarkAsPickedUpPopup } from '@/components/client/orders/mark-as-picked-up-popup';
import { RestoreOrderPopup } from '@/components/client/orders/restore-order-popup';
import PageHead from '@/components/client/orders/show/header';
import { UnasignDriverPopup } from '@/components/client/orders/unasign-driver-popup';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { OrderSourcesEnum, OrderStatus } from '@/enums';
import {
    AttachmentsForm,
    ContactFooterContextProvider,
    CreateEditOrderInternalNotePopup,
    DeleteOrderPopup,
    getMainLayout,
    MarkAsDeliveredPopup,
    MarkAsNewPopup,
    OrderActions,
    OrderActivityPaper,
    OrderAdditionalDocumentsPaper,
    OrderDetailsDrawer,
    OrderDetailsPaper,
    OrderDriverPaymentFormDrawer,
    OrderDriverPaymentFormPaper,
    OrderExpenses,
    OrderInformation,
    OrderInspectionsPaper,
    OrderInternalNotesPaper,
    OrderMarkAsPaidDrawer,
    OrderPickupAndDeliveryPaper,
    OrderReviewPaper,
    OrderSendBOLDrawer,
    OrderSendInvoiceDrawer,
    RequestsDrawer,
    SendOfferToRequestDrawer,
} from '@components';
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
