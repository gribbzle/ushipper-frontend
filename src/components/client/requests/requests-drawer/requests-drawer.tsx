import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import DrawerBody from '@/components/client/requests/requests-drawer/drawer-body';
import { Drawer } from '@/components/common/drawer/drawer';
import { useGetRequestsQuery } from '@store/api/order-requests-api';
import { useGetOrderQuery } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './requests-drawer.scss';

const t = translateByNamespace('client:requests-page:drawer');
const cn = classname('requests-drawer');

export const RequestsDrawer = () => {
    const router = useRouter();
    const [cursor, setCursor] = useState<string | undefined>();

    const onClose = async () => {
        const newQuery = {
            ...router.query,
            requestsOrderId: null,
        };

        await router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            {
                pathname: router.asPath.split('?')[0],
                query: newQuery,
            },
        );

        setCursor(undefined);
    };

    const orderData = useGetOrderQuery(router.query.requestsOrderId as string, { skip: !router.query.requestsOrderId });
    const { data: response } = useGetRequestsQuery(
        {
            orderId: router.query.requestsOrderId as string,
            cursor,
        },
        { skip: !router.query.requestsOrderId },
    );

    const handleShowMoreRequests = useCallback(() => {
        setCursor(response?.nextCursor || undefined);
    }, [response?.nextCursor]);

    return (
        <Drawer
            className={cn()}
            isOpen={!!router.query.requestsOrderId}
            onClose={onClose}
            head={
                <div className={cn('header')}>
                    <span>{t('title')}</span>
                    <OrderTag view='new'>{t('active', { counter: response?.requests.length ?? 0 })}</OrderTag>
                </div>
            }
            body={<DrawerBody order={orderData.data} requests={response?.requests} cursor={response?.nextCursor} onShowMoreClick={handleShowMoreRequests} />}
        />
    );
};
