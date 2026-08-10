import React, { useMemo } from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { Table } from '@/components/common/table/table';
import { TableColumn } from '@/components/common/table/table.types';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './data-table-block.scss';
import PlusIcon from '@/assets/icons/plus.svg';

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
