import React, { useCallback } from 'react';
import Head from 'next/head';

import { MarkAsPickedUpPopup } from '@/components/client/orders/mark-as-picked-up-popup';
import { OrderItem, ShipperOrderItem } from '@/components/client/orders/order-item';
import { RestoreOrderPopup } from '@/components/client/orders/restore-order-popup';
import { UnasignDriverPopup } from '@/components/client/orders/unasign-driver-popup';
import { useOrdersPageHeader } from '@/hooks/order/use-orders-page-header';
import {
    Button,
    getMainLayout,
    Link,
    MarkAsDeliveredPopup,
    OrderSendBOLDrawer,
    OrderSendOfferToCarrierDrawer,
    OrderSetDispatcherDrawer,
    OrderSetDriverDrawer,
    OrdersList,
    OrdersPageLayout,
    RequestsDrawer,
    SendOfferToRequestDrawer,
    UploadOrderLoader,
} from '@components';
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
