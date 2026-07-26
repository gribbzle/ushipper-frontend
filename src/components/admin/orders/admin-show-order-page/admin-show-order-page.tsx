import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import PageHead from '@/components/client/orders/show/header';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { OrderStatus } from '@/enums';
import { useOrdersActionsPermission } from '@/hooks/order';
import {
    AttachmentsForm,
    ContactFooterContextProvider,
    getMainLayout,
    OrderActions,
    OrderActivityPaper,
    OrderAdditionalDocumentsPaper,
    OrderDetailsPaper,
    OrderDriverPaymentFormDrawer,
    OrderExpenses,
    OrderInformation,
    OrderInspectionsPaper,
    OrderInternalNotesPaper,
    OrderPickupAndDeliveryPaper,
    OrderReviewPaper,
    OrderSendBOLDrawer,
    RecalculateTransactionsPopup,
} from '@components';
import { useScrollTop } from '@hooks';
import { useAppDispatch } from '@store';
import { useGetOrderQuery } from '@store/api/orders-api';
import { ordersActions } from '@store/client';
import { classname, getProjectName, isFreightX, isUshipper, translateByNamespace } from '@utils';

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
                {isError && (error as any).status === 403 && <AccessForbiddenBlock />}
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
