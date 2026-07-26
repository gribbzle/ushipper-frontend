import React, { useMemo } from 'react';

import { AlertBlock, Button, Table, TableColumn } from '@/components/common';
import { FormControl, InputLabel } from '@fields';
import { PlusIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import './data-table-block.scss';

const cn = classname('data-table-block');
const tAdd = translateByNamespace('common:staff-table');

type DataTableBlockProps<T> = {
    titleLabel: string;
    data: T[];
    columns: TableColumn<T>[];
    emptyStateText: string;
    onAddBtn?: () => void;
    className?: string;
};

export const DataTableBlock = <T extends Record<string, unknown>>({
    titleLabel,
    data,
    columns,
    emptyStateText,
    className,
    onAddBtn,
}: DataTableBlockProps<T>) => {
    const title = useMemo(
        () => (
            <div className={cn('title')}>
                {titleLabel}
                {onAddBtn && (
                    <Button onClick={onAddBtn} size='mini'>
                        <PlusIcon />
                        {tAdd('add')}
                    </Button>
                )}
            </div>
        ),
        [onAddBtn, titleLabel],
    );

    return (
        <FormControl className={cn('items', [className])}>
            <InputLabel>{title}</InputLabel>
            {data.length > 0 ? (
                <Table<T> columns={columns} data={data} isRowClickable={() => false} className={cn('table')} />
            ) : (
                <AlertBlock>{emptyStateText}</AlertBlock>
            )}
        </FormControl>
    );
};
