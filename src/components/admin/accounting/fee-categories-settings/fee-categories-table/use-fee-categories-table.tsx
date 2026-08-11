import React, { useCallback, useEffect, useMemo } from 'react';

import { TableColumn } from '@/components/common/table/table.types';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, createEditFeeCategoryBlockPropsSelector } from '@store/admin';
import { useGetFeeCategoriesQuery } from '@store/api/fee-categories-api';
import { FeeCategory } from '@/types/fee-category';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getFeeCategoryTypeTranslate } from '@utils/translate/get-fee-category-type-translate';

import './fee-categories-table.scss';

const cn = classname('fee-categories-table');
const t = translateByNamespace('admin:accounting:fee-categories-settings:table');
const tActions = translateByNamespace('common:staff-table');

export const useFeeCategoriesTable = () => {
    const dispatch = useAppDispatch();
    const { data: feesCategoriesData } = useGetFeeCategoriesQuery();
    const { selectedFeeCategory, isEditMode } = useAppSelector(createEditFeeCategoryBlockPropsSelector);

    const onRowClickHandler = useCallback(
        (feeCategory: FeeCategory | null) =>
            dispatch(accountingActions.setCreateEditFeeCategoryBlockProps({ selectedFeeCategory: feeCategory, isEditMode: Boolean(feeCategory) })),
        [dispatch],
    );

    const onDeleteClickHandler = useCallback(
        (feeCategory: FeeCategory) =>
            dispatch(
                accountingActions.setDeleteFeeCategoryPopupProps({
                    isVisible: true,
                    feeCategoryId: feeCategory.id,
                    feeCategoryName: feeCategory.name,
                }),
            ),
        [dispatch],
    );

    useEffect(() => {
        if (isEditMode && !selectedFeeCategory && feesCategoriesData) {
            onRowClickHandler(feesCategoriesData[0]);
        }
    }, [isEditMode, selectedFeeCategory, feesCategoriesData, onRowClickHandler]);

    const columns = useMemo<TableColumn<FeeCategory>[]>(
        () => [
            { key: 'name', name: t('fee-categories-name-column-label'), cellClassName: cn('cell'), headerCellClassName: cn('header-cell') },
            {
                key: 'type',
                name: t('wallet-type-column-label'),
                cellClassName: cn('cell'),
                headerCellClassName: cn('header-cell'),
                cellRender: ({ row: { type } }) => getFeeCategoryTypeTranslate(type),
            },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row }) => (
                    <TableRowMenu
                        dataTestId='fee-categories-table-actions'
                        options={[
                            {
                                label: tActions('edit-button-label'),
                                show: row.id !== selectedFeeCategory?.id,
                                onClick: () => onRowClickHandler(row),
                            },
                            {
                                label: tActions('delete-button-label'),
                                onClick: () => onDeleteClickHandler(row),
                            },
                        ]}
                    />
                ),
                cellClassName: cn('cell'),
                headerCellClassName: cn('header-cell'),
            },
        ],
        [selectedFeeCategory, onDeleteClickHandler, onRowClickHandler],
    );

    return { feesCategoriesData, columns, selectedFeeCategory, isEditMode, onRowClickHandler };
};
