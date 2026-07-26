import React from 'react';

import {
    BackLink,
    CreateEditOrderInternalNotePopup,
    DeleteOrderPopup,
    MarkAsNewPopup,
    OrderDriverPaymentFormDrawer,
    OrderMarkAsPaidDrawer,
    OrdersEmptyTabPanel,
    OrderSendInvoiceDrawer,
    StatisticCounters,
} from '@components';
import { useMeDriverRelated } from '@hooks';
import { classname, translateByNamespace, translateOrderStatisticsGroup } from '@utils';

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
