import React from 'react';

import { Table } from '@/components/common';
import { FeeCategory } from '@types';
import { classname } from '@utils';

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
