import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { toKebabCase } from 'js-convert-case';

import { Drawer } from '@/components/common/drawer/drawer';
import { Table } from '@/components/common/table/table';
import { TableColumn } from '@/components/common/table/table.types';
import { ChangeDetails, ChangeLog } from '@/shared';
import { useAppDispatch, useAppSelector } from '@store';
import { orderActivityDetailsDrawerPropsSelector, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { renderValue } from './utils';

import './order-activity-details-drawer.scss';

export type OrderActivityDetails = ChangeDetails;

const NoDetailsMessage = () => <div className={cn('empty-label')}>{t('no-activity-details')}</div>;

const t = translateByNamespace('client:order:activity:activity-details-drawer');
const tTable = translateByNamespace('client:order:activity:activity-details-drawer:table');
const cn = classname('order-activity-details-drawer');

export const OrderActivityDetailsDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, details, createdAt, creatorName } = useAppSelector(orderActivityDetailsDrawerPropsSelector);

    const handleDrawerClose = useCallback(() => {
        dispatch(ordersActions.setOrderActivityDetailsDrawerProps({ isVisible: false, details: null, creatorName: null, createdAt: null }));
    }, [dispatch]);

    const columns = useMemo<TableColumn<ChangeLog>[]>(
        () => [
            {
                key: 'field',
                name: tTable('field-column-title'),
                cellRender: ({ row: { field } }) => <span className={cn('field')}>{tTable(toKebabCase(field))}</span>,
            },

            {
                key: 'prev_value',
                name: tTable('prev-value-column-title'),
                cellRender: ({ row: { prevValue, field } }) => <span className={cn('value')}>{renderValue(prevValue, field)}</span>,
            },
            {
                key: 'new_value',
                name: tTable('new-value-column-title'),
                cellRender: ({ row: { newValue, field } }) => <span className={cn('value')}>{renderValue(newValue, field)}</span>,
            },
        ],
        [],
    );

    const renderDetails = useCallback(() => {
        if (!details) {
            return <NoDetailsMessage />;
        }

        const { originalAttributes, changedAttributes } = details as OrderActivityDetails;

        const allKeys = Array.from(new Set([...Object.keys(originalAttributes || {}), ...Object.keys(changedAttributes || {})]));

        const changesLogsData: ChangeLog[] = allKeys
            .map((key, index) => ({
                id: `${key}-${index}`,
                field: key,
                prevValue: originalAttributes?.[key] === undefined ? null : originalAttributes?.[key],
                newValue: changedAttributes?.[key] === undefined ? null : changedAttributes?.[key],
            }))
            .filter(({ prevValue, newValue }) => !(prevValue === null && newValue === null));

        return (
            <>
                <p className={cn('title')}>
                    <strong>{creatorName}</strong> {t('has-made-changes-text')}
                    {createdAt && (
                        <strong>
                            {' '}
                            {t('created-time', {
                                date: format(new Date(createdAt), 'MMM dd '),
                                time: format(new Date(createdAt), 'HH:mm '),
                            })}
                        </strong>
                    )}
                </p>
                {changesLogsData.length > 0 ? <Table<ChangeLog> columns={columns} data={changesLogsData} /> : <NoDetailsMessage />}
            </>
        );
    }, [details, creatorName, createdAt, columns]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={<div className={cn('content')}>{renderDetails()}</div>}
        />
    );
};
