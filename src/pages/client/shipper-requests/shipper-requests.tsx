import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';

import { ShipperOrderItem } from '@/components/client/orders/order-item';
import { getMainLayout, OrderSendOfferToCarrierDrawer, OrdersList, OrdersPageLayout, PageHeader, RequestsDrawer, SendOfferToRequestDrawer } from '@components';
import { useMeShipper } from '@hooks';
import { useAppDispatch } from '@store';
import { Load, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('client:requests-page');

const ShipperRequests = () => {
    const renderOrdersListComponent = useCallback((orders: Load[]) => {
        return <OrdersList OrderItem={ShipperOrderItem} orders={orders} />;
    }, []);

    const isShipper = useMeShipper();

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(
                ordersActions.setOrderSendOfferToCarrierDrawerProps({
                    isVisible: false,
                    orderId: null,
                }),
            );
        };
    }, [dispatch]);

    return (
        <>
            <OrdersPageLayout
                emptyListTitle={t('empty-list')}
                hideBtnInEmptyList={isShipper}
                renderOrdersListComponent={renderOrdersListComponent}
                requestsPageContext={true}
            />
            <SendOfferToRequestDrawer />
            <OrderSendOfferToCarrierDrawer />
            <RequestsDrawer />
        </>
    );
};

const PageHead = () => (
    <>
        <Head>
            <title>{t('page-title', { projectName: getProjectName() })}</title>
        </Head>
        <PageHeader>{t('title')}</PageHeader>
    </>
);

ShipperRequests.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'shipperOrders', functionality: 'shipper.my_orders.requests.view_any' }],
});

export default ShipperRequests;
