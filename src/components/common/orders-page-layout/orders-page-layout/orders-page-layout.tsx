import React from 'react';

import { OrderDriverPaymentFormDrawer } from '@/components/client/orders/drawers/order-driver-payment-form-drawer/order-driver-payment-form-drawer';
import { OrderMarkAsPaidDrawer } from '@/components/client/orders/drawers/order-mark-as-paid-drawer/order-mark-as-paid-drawer';
import { OrderSendInvoiceDrawer } from '@/components/client/orders/drawers/order-send-invoice-drawer/order-send-invoice-drawer';
import { MarkAsNewPopup } from '@/components/client/orders/mark-as-new-popup/mark-as-new-popup';
import { OrdersEmptyTabPanel } from '@/components/client/orders/orders-empty-tab-panel/orders-empty-tab-panel';
import { CreateEditOrderInternalNotePopup } from '@/components/client/orders/popups/create-edit-order-internal-note-popup/create-edit-order-internal-note-popup';
import { DeleteOrderPopup } from '@/components/client/orders/popups/delete-order-popup/delete-order-popup';
import { StatisticCounters } from '@/components/client/orders/statistic-counters/statistic-counters';
import { BackLink } from '@/components/common/back-link/back-link';
import { useMeDriverRelated } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderStatisticsGroup } from '@utils/translate/order/translations';

import { EmptyOrdersPanel } from '../empty-orders-panel';
import { OrdersFilters } from '../orders-filters';
import { OrdersPaginator } from '../orders-paginator';

import { OrderListLayoutProps } from './orders-page-layout.types';
import { useOrdersPageLayout } from './useOrdersPageLayout';

import '../orders.scss';

const tBackLink = translateByNamespace('client:orders-page');
const cn = classname('orders-page');

export const OrdersPageLayout = ({ renderOrdersListComponent, requestsPageContext, hideBtnInEmptyList, emptyListTitle }: OrderListLayoutProps) => {
    const {
        showOrdersList,
        showEmptyTabPanel,
        showEmptyOrdersPanel,
        groupFilter,
        statusFilter,
        allFilters,
        statisticsCounters,
        ordersPaginatedData,
        customBackToOrders,
        handleCounterClick,
        handleTabFilterClick,
        handleFiltersChange,
        handlePageChange,
    } = useOrdersPageLayout(requestsPageContext);

    const isDriver = useMeDriverRelated();

    return (
        <div className={cn()}>
            <MarkAsNewPopup orderListContext={true} />
            <DeleteOrderPopup />
            <OrderMarkAsPaidDrawer />
            <CreateEditOrderInternalNotePopup />
            <OrderSendInvoiceDrawer />
            <OrderDriverPaymentFormDrawer />

            {showEmptyOrdersPanel ? (
                <EmptyOrdersPanel showLink={!isDriver} />
            ) : (
                <div className={cn('body')}>
                    {!requestsPageContext && (
                        <StatisticCounters statisticsCounters={statisticsCounters} value={groupFilter} onCounterClick={handleCounterClick} />
                    )}
                    {!!groupFilter && (
                        <div className={cn('back-from-group-filter')}>
                            <div className={cn('group-filter-title')}>{translateOrderStatisticsGroup(groupFilter)}</div>
                            <BackLink className={cn('group-link')} label={tBackLink('back-to-orders')} customBackHandler={customBackToOrders} />
                        </div>
                    )}
                    {!groupFilter && (
                        <OrdersFilters
                            initialFilters={allFilters}
                            onFiltersChange={handleFiltersChange}
                            onTabFilterClick={handleTabFilterClick}
                            initialStatusFilter={statusFilter}
                            statisticsCounters={statisticsCounters}
                            hideTabs={!!requestsPageContext}
                        />
                    )}

                    {!!ordersPaginatedData?.data.length && (
                        <div className={cn('orders-and-paginator')}>
                            {showOrdersList && renderOrdersListComponent(ordersPaginatedData.data)}
                            <OrdersPaginator ordersPaginatedData={ordersPaginatedData} handlePageChange={handlePageChange} />
                        </div>
                    )}
                    {showEmptyTabPanel && <OrdersEmptyTabPanel title={emptyListTitle} hideBtn={hideBtnInEmptyList} status={statusFilter} group={groupFilter} />}
                </div>
            )}
        </div>
    );
};
