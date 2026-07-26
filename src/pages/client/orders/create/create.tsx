import React from 'react';
import Head from 'next/head';

import Header from '@/components/client/orders/create/header';
import { getMainLayout, OrderGeneralForm } from '@components';
import { useEffectOnce } from '@hooks';
import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';
import { classname, getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('client:order:create-page');
const cn = classname('order-create-page');

const CreateOrderPage = () => {
    const dispatch = useAppDispatch();

    useEffectOnce(() => {
        dispatch(ordersActions.clearOrder());
    }, [dispatch]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <OrderGeneralForm />
        </div>
    );
};

CreateOrderPage.getLayout = getMainLayout({
    head: <Header />,
    permissions: [
        { scope: 'carrierOrders', functionality: 'carrier.orders.create' },
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.update' },
    ],
});

export default CreateOrderPage;
