import React, { useCallback } from 'react';
import Head from 'next/head';

import { MarkAsPickedUpPopup } from '@/components/client/orders/mark-as-picked-up-popup';
import { OrderItem, ShipperOrderItem } from '@/components/client/orders/order-item';
import { RestoreOrderPopup } from '@/components/client/orders/restore-order-popup';
import { UnasignDriverPopup } from '@/components/client/orders/unasign-driver-popup';
import { useOrdersPageHeader } from '@hooks/order/use-orders-page-header';
import { Button } from '@/components/common/button/button';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { Link } from '@/components/common/link/link';
import { MarkAsDeliveredPopup } from '@/components/client/orders/popups/mark-as-delivered-popup/mark-as-delivered-popup';
import { OrderSendBOLDrawer } from '@/components/client/orders/drawers/order-send-bol-drawer/order-send-bol-drawer';
import { OrderSendOfferToCarrierDrawer } from '@/components/client/orders/drawers/order-send-offer-to-carrier-drawer/order-send-offer-to-carrier-drawer';
import { OrderSetDispatcherDrawer } from '@/components/client/orders/drawers/order-set-dispatcher-drawer/order-set-dispatcher-drawer';
import { OrderSetDriverDrawer } from '@/components/client/orders/drawers/order-set-driver-drawer/order-set-driver-drawer';
import { OrdersList } from '@/components/client/orders/orders-list/orders-list';
import { OrdersPageLayout } from '@/components/common/orders-page-layout/orders-page-layout/orders-page-layout';
import { RequestsDrawer } from '@/components/client/requests/requests-drawer/requests-drawer';
import { SendOfferToRequestDrawer } from '@/components/client/requests/send-offer-to-request-drawer/send-offer-to-request-drawer';
import { UploadOrderLoader } from '@/components/client/orders/upload-order-loader/upload-order-loader';
import { useMeCarrier, useMeDriverRelated, useMeShipper } from '@hooks';
import { PlusCircleIcon, UploadIcon } from '@icons';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('client:orders-page');
const cn = classname('orders-page');

const OrdersPage = () => {
    const isMeShipper = useMeShipper();
    const isMeCarrier = useMeCarrier();

    const renderOrdersListComponent = useCallback(
        (orders: Load[]) => {
            return <OrdersList OrderItem={isMeShipper ? ShipperOrderItem : OrderItem} orders={orders} />;
        },
        [isMeShipper],
    );

    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <OrdersPageLayout renderOrdersListComponent={renderOrdersListComponent} />

            {isMeCarrier && (
                <>
                    <UnasignDriverPopup />
                    <MarkAsPickedUpPopup />
                    <MarkAsDeliveredPopup />
                    <OrderSetDriverDrawer />
                    <OrderSetDispatcherDrawer />
                    <OrderSendBOLDrawer />
                </>
            )}
            {isMeShipper && (
                <>
                    <OrderSendOfferToCarrierDrawer />
                    <RequestsDrawer />
                    <SendOfferToRequestDrawer />
                </>
            )}
            <RestoreOrderPopup />
        </>
    );
};

const PageHead = () => {
    const { inputRef, isLoading, onOrderFileUpload } = useOrdersPageHeader();
    const isDriver = useMeDriverRelated();

    return (
        <div className={cn('header')}>
            {t('header')}
            {!isDriver && (
                <>
                    <Link href='/client/orders/create' as='/orders/create'>
                        <Button view='primary' size='medium'>
                            <PlusCircleIcon /> {t('add-order-button-label')}
                        </Button>
                    </Link>
                    <Button view='default' size='medium' onClick={() => !isLoading && inputRef.current?.click()}>
                        {isLoading ? (
                            <UploadOrderLoader />
                        ) : (
                            <>
                                <UploadIcon /> {t('upload-order-button-label')}
                            </>
                        )}
                    </Button>
                    <input
                        ref={inputRef}
                        onChange={event => event.target.files && onOrderFileUpload(event.target.files[0])}
                        type='file'
                        accept='application/pdf'
                    />
                </>
            )}
        </div>
    );
};

OrdersPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.view_any' },
        { scope: 'carrierOrders', functionality: 'carrier.orders.view_any' },
    ],
});

export default OrdersPage;
