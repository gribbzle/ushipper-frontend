import { useCallback } from 'react';

import { TableProps } from '../table.types';

import { useVisibleColumns } from './use-visible-columns';

export const useOnOrderChangeHandler = <T>({ columns, orderDirection, onOrderChange }: Pick<TableProps<T>, 'columns' | 'orderDirection' | 'onOrderChange'>) => {
    const { visibleColumns } = useVisibleColumns({ columns });

    const onOrderChangeHandler = useCallback(
        (column: string) => {
            if (!visibleColumns.find(({ key, isSortable }) => isSortable && key === column)) {
                return;
            }

            onOrderChange?.(column, !orderDirection || orderDirection === 'asc' ? 'desc' : 'asc');
        },
        [visibleColumns, onOrderChange, orderDirection],
    );

    return { onOrderChangeHandler };
};
