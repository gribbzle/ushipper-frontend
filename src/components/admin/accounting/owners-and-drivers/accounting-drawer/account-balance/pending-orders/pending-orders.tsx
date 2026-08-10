import React from 'react';

import { Button } from '@/components/common/button/button';
import { OrderProvider } from '@providers';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountTransactionsBlock } from '../account-transactions-block';
import { PendingOrderItem } from '../pending-order-item';

import { usePendingOrders } from './use-pending-orders';

import './pending-orders.scss';

const cn = classname('pending-orders');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');

export const PendingOrders = () => {
    const { onViewMoreOrdersClick, areMoreOrders, ordersPaginatedData, subTitle } = usePendingOrders();

    if (!ordersPaginatedData?.data?.length) {
        return null;
    }

    return (
        <AccountTransactionsBlock title={t('pending-orders-title')} subTitle={subTitle} showViewAllButton={false}>
            <div className={cn()}>
                {ordersPaginatedData?.data.map(order => (
                    <OrderProvider value={order} key={order.publicId}>
                        <PendingOrderItem />
                    </OrderProvider>
                ))}
                {areMoreOrders && (
                    <Button view='link' active={true} size='mini' onClick={onViewMoreOrdersClick}>
                        {t('view-all-orders-btn-label')}
                    </Button>
                )}
            </div>
        </AccountTransactionsBlock>
    );
};
