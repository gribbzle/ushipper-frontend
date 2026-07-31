import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '@/components/client/orders/edit/header';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { getMainLayout, OrderGeneralForm } from '@components';
import { useIsPartnerCompany } from '@hooks';
import { useGetOrderQuery } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './edit.scss';

const t = translateByNamespace('client:order:edit-page');
const cn = classname('edit-order-page');

export const EditOrderPage = () => {
    const isPartner = useIsPartnerCompany();
    const { query } = useRouter();

    const orderId = query['order-id'] as string;

    const { data: order, isLoading, isError, error } = useGetOrderQuery(orderId);

    const form = useMemo(() => {
        if (!isLoading && order) {
            const { cdContract, ...others } = order;

            return <OrderGeneralForm initialValues={{ ...others }} isFulled={!isPartner} />;
        }

        return null;
    }, [isLoading, order, isPartner]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>

            {!isError && form}
            {isError && (error as any).status === 403 && <AccessForbiddenBlock />}
        </div>
    );
};

EditOrderPage.getLayout = getMainLayout({
    head: <Header />,
    permissions: [
        { scope: 'carrierOrders', functionality: 'carrier.orders.update' },
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.all_orders.update' },
    ],
});

export default EditOrderPage;
