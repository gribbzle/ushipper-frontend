import React, { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { OrderDriverPaymentFormDrawer } from '@/components/client/orders/drawers/order-driver-payment-form-drawer/order-driver-payment-form-drawer';
import { OrderSendBOLDrawer } from '@/components/client/orders/drawers/order-send-bol-drawer/order-send-bol-drawer';
import { AttachmentsForm } from '@/components/client/orders/forms/attachments-form/attachments-form';
import { ContactFooterContextProvider } from '@/components/client/orders/forms/common/contact-footer-context/contact-footer-context';
import { OrderActions } from '@/components/client/orders/order-actions/order-actions';
import { OrderActivityPaper } from '@/components/client/orders/papers/order-activity-paper/order-activity-paper';
import { OrderAdditionalDocumentsPaper } from '@/components/client/orders/papers/order-additional-documents-paper/order-additional-documents-paper';
import { OrderDetailsPaper } from '@/components/client/orders/papers/order-details-paper/order-details-paper';
import { OrderExpenses } from '@/components/client/orders/papers/order-expenses-paper/order-expenses';
import { OrderInternalNotesPaper } from '@/components/client/orders/papers/order-internal-notes-paper/order-internal-notes-paper';
import { OrderPickupAndDeliveryPaper } from '@/components/client/orders/papers/order-pickup-and-delivery-paper/order-pickup-and-delivery-paper';
import { OrderReviewPaper } from '@/components/client/orders/papers/order-review-paper/order-review-paper';
import PageHead from '@/components/client/orders/show/header';
import { OrderInformation } from '@/components/client/orders/show/order-information/order-information';
import { OrderInspectionsPaper } from '@/components/client/orders/show/order-inspections-paper/order-inspections-paper';
import { RecalculateTransactionsPopup } from '@/components/client/orders/show/recalculate-order-transactions-popup/recalculate-order-transactions-popup';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { OrderStatus } from '@/enums/order-status';
import { useOrdersActionsPermission } from '@/hooks/order/use-orders-actions-permission';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { useAppDispatch } from '@store';
import { useGetOrderQuery } from '@store/api/orders-api';
import { ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX, isUshipper } from '@utils/project-config';
import { getProjectName } from '@utils/translate/get-project-name';

import './admin-show-order-page.scss';

const t = translateByNamespace('client:order:show-page');
const cn = classname('admin-show-order-page');

const AdminShowOrderPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const orderId = router.query['order-id'] as string;
    const [isCleared, setIsCleared] = useState<boolean>(false);

    useEffect(() => {
        const clearData = async () => {
            await dispatch(ordersActions.clearOrder());
            setIsCleared(true);
        };

        clearData();
    }, [dispatch]);

    const { isError, error, isLoading, data } = useGetOrderQuery(orderId, { skip: !isCleared || !orderId });

    useScrollTop('.main-layout__body');

    const isPartner = data?.company?.isPartner;
    const showInspection = isUshipper && !!data?.vehicles.length;
    const showExpenses = !isPartner;

    if (!isCleared) {
        return null;
    }

    return (
        <>
            <ContactFooterContextProvider>
                {!isError && (
                    <div className={cn('')}>
                        <Head>
                            <title>{t('title', { projectName: getProjectName() })}</title>
                        </Head>
                        <div className={cn('wrapper')}>
                            <OrderAdditionalDocumentsPaper />
                            {data?.status === OrderStatus.DELIVERED && <OrderReviewPaper />}
                            <OrderInformation />
                            <OrderDetailsPaper />
                            <OrderPickupAndDeliveryPaper isLoading={isLoading} />

                            <div className={cn('column-wrapper', { freightx: isFreightX })}>
                                {(showExpenses || showInspection) && (
                                    <div className={cn('column')}>
                                        {showInspection && <OrderInspectionsPaper />}
                                        {showExpenses && <OrderExpenses />}
                                    </div>
                                )}

                                <div className={cn('column', { freightx: isFreightX })}>
                                    {isFreightX ? (
                                        <>
                                            <AttachmentsForm orderId={orderId} disabled={true} />
                                            <OrderInternalNotesPaper />
                                            <OrderActivityPaper />
                                        </>
                                    ) : (
                                        <>
                                            <OrderInternalNotesPaper />
                                            <AttachmentsForm orderId={orderId} disabled={true} />
                                            <OrderActivityPaper />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <OrderSendBOLDrawer />
                        <OrderDriverPaymentFormDrawer />
                    </div>
                )}
                {isError && (error as AxiosResponse<AxiosError>).status === 403 && <AccessForbiddenBlock />}
            </ContactFooterContextProvider>
            <RecalculateTransactionsPopup />
        </>
    );
};

const AdminOrderPageHead = () => {
    const hasOrdersActionsPermission = useOrdersActionsPermission();

    return <PageHead renderActionsComponent={order => (hasOrdersActionsPermission ? <OrderActions order={order} /> : <></>)} />;
};

AdminShowOrderPage.getLayout = getMainLayout({
    head: <AdminOrderPageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
});

export default AdminShowOrderPage;
