import React, { Fragment, useCallback, useMemo } from 'react';

import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { TableColumn } from '@/components/common/table/table.types';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { PaymentTerm } from '@/enums/payment-term';
import { getPaymentTermTranslate } from '@/utils/payment';
import { useAppDispatch } from '@store';
import { BlackListItem, fetchBlackListItemAction } from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { formatDateOrGetDash } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:black-list-page');
const columnsT = translateByNamespace('common:black-list-page:table:columns');
const tableActionsT = translateByNamespace('common:black-list-page:table:actions');

export const useBlackListTableColumns = () => {
    const dispatch = useAppDispatch();

    const onEditClickHandler = useCallback(
        (publicId: string) => {
            dispatch(fetchBlackListItemAction(publicId)).then(() => {
                dispatch(blackListActions.setCreateEditModalProps({ mode: 'edit', blackListPublicId: publicId, isVisible: true }));
            });
        },
        [dispatch],
    );

    const columns = useMemo<TableColumn<BlackListItem>[]>(
        () => [
            { key: 'name', name: columnsT('name') },
            { key: 'usdot', name: columnsT('mc'), cellRender: ({ value }) => value ?? '—' },
            {
                key: 'terms',
                name: columnsT('terms'),
                cellRender: ({ value }) => {
                    if (value.length === 0) {
                        return t('table:empty-terms');
                    }

                    return (value as PaymentTerm[]).map(term => getPaymentTermTranslate(term)).join(', ');
                },
            },
            {
                key: 'notes',
                name: columnsT('notes'),
                cellRender: ({ value }) => {
                    if (!value) {
                        return;
                    }

                    return value.split('\n').map((line: string, index: number) => (
                        <Fragment key={index}>
                            {index !== 0 && <br />}
                            {line}
                        </Fragment>
                    ));
                },
            },
            { key: 'creator', name: 'Created By', cellRender: ({ value }) => <UserInfoBlock {...value} /> },
            { key: 'createdAt', name: columnsT('created-at'), cellRender: ({ value }) => formatDateOrGetDash(value) },
            { key: 'updatedAt', name: columnsT('updated-at'), cellRender: ({ value }) => formatDateOrGetDash(value) },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row: { publicId, name } }) => {
                    return (
                        <TableRowMenu
                            dataTestId='black-list-table-actions'
                            options={[
                                {
                                    label: tableActionsT('edit'),
                                    onClick: () => {
                                        onEditClickHandler(publicId);
                                    },
                                },
                                {
                                    label: tableActionsT('delete'),
                                    onClick: () => {
                                        dispatch(
                                            blackListActions.setDeleteBlackListItemPopupProps({
                                                isVisible: true,
                                                blackListPublicId: publicId,
                                                blackListName: name,
                                            }),
                                        );
                                    },
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [dispatch, onEditClickHandler],
    );

    return { columns, onEditClickHandler };
};
