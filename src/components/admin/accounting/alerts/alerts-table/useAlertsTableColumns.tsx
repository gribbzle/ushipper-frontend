import React, { useMemo } from 'react';

import { AttachmentItem } from '@/components/common/attachment-item/attachment-item';
import { AdminOrderIdInfo } from '@/components/common/table/common/admin-order-id-info/admin-order-id-info';
import { DateInfo } from '@/components/common/table/common/date-info/date-info';
import { OrderPriceInfo } from '@/components/common/table/common/order-price-info/order-price-info';
import { TableColumn } from '@/components/common/table/table.types';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { ImageProvider } from '@/providers/ImageProvider';
import { IssueProvider } from '@/providers/IssueProvider';
import { OrderProvider } from '@/providers/OrderProvider';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AlertStatusTag } from './alert-status-tag';
import { AlertTypeInfo } from './alert-type-info';
import { OrderDriverInfo } from './order-driver-info';
import { ProcessedByInfo } from './processed-by-info';
import { IssueDataWithOrder } from './use-alerts-table';

import './alerts-table.scss';

const cn = classname('alerts-table');

const t = translateByNamespace('admin:accounting:alerts:table');
const tColumnTitle = translateByNamespace('admin:orders-page:table-columns-title');

export const useAlertsTableColumns = () => {
    return useMemo(
        (): TableColumn<IssueDataWithOrder>[] => [
            {
                key: 'created_at',
                name: t('created-at'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('created-at'),
            },
            {
                key: 'order_id',
                name: tColumnTitle('order-id'),
                cellRender: ({ row: { order } }) =>
                    order ? (
                        <OrderProvider value={order}>
                            <AdminOrderIdInfo showPublicId={false} showProducts={false} className={cn('cell', { 'order-id': true })} />
                        </OrderProvider>
                    ) : (
                        '—'
                    ),
            },
            {
                key: 'price',
                name: tColumnTitle('price'),
                cellRender: ({ row: { order } }) => {
                    if (!order) {
                        return <>—</>;
                    }

                    return (
                        <OrderProvider value={order}>
                            <OrderPriceInfo showInstantPaymentMethod={true} className={cn('cell', { price: true })} />
                        </OrderProvider>
                    );
                },
            },
            {
                key: 'company_name',
                name: tColumnTitle('company'),
                cellRender: ({ row: { order } }) => {
                    if (!order) {
                        return <>—</>;
                    }

                    const { company } = order;

                    return company ? (
                        <div className={cn('cell', { company: true })}>
                            <h4 className={cn('column-text')}>{company.name}</h4>
                        </div>
                    ) : (
                        <>—</>
                    );
                },
            },
            {
                key: 'driver',
                name: tColumnTitle('driver'),
                cellRender: ({ row: { order } }) => {
                    const { driver } = order || {};

                    return <OrderDriverInfo driver={driver} showChatButton={true} />;
                },
                headerCellClassName: cn('driver'),
            },
            {
                key: 'dispatcher',
                name: tColumnTitle('dispatcher'),
                cellRender: ({ row: { order } }) => {
                    const { dispatcher } = order || {};

                    return dispatcher ? <UserInfoBlock avatar={dispatcher.avatar} name={dispatcher.name} nickname={dispatcher.nickname} /> : '—';
                },
            },
            {
                key: 'type',
                name: t('alert-type'),
                cellRender: ({ row }) => (
                    <IssueProvider value={row}>
                        <AlertTypeInfo />
                    </IssueProvider>
                ),
                headerCellClassName: cn('alert-type'),
            },
            {
                key: 'cd_contract',
                name: tColumnTitle('contract'),
                cellRender: ({ row: { order } }) => (
                    <ImageProvider>
                        <AttachmentItem attachment={order?.cdContract} />
                    </ImageProvider>
                ),
                headerCellClassName: cn('contract'),
            },
            {
                key: 'alert_status',
                name: t('alert-status'),
                cellRender: ({ row }) => (
                    <IssueProvider value={row}>
                        <AlertStatusTag />
                    </IssueProvider>
                ),
                headerCellClassName: cn('alert-status'),
            },
            {
                key: 'processed_by',
                name: t('processed-by'),
                cellRender: ({ row }) => (
                    <IssueProvider value={row}>
                        <ProcessedByInfo />
                    </IssueProvider>
                ),
                headerCellClassName: cn('processed-by'),
            },
        ],
        [],
    );
};
