import React from 'react';

import { Table } from '@/components/common/table/table';
import { FeeCategory } from '@/types/fee-category';
import { classname } from '@utils/classname';

import { useFeeCategoriesTable } from './use-fee-categories-table';

import './fee-categories-table.scss';

const cn = classname('fee-categories-table');

export const FeeCategoriesTable = () => {
    const { selectedFeeCategory, feesCategoriesData, columns, onRowClickHandler } = useFeeCategoriesTable();

    return (
        <Table<FeeCategory>
            className={cn()}
            columns={columns}
            data={feesCategoriesData ?? []}
            isRowClickable={() => true}
            highlightClickedRow={true}
            onRowClick={onRowClickHandler}
            clickedRowId={selectedFeeCategory?.id ?? null}
        />
    );
};
