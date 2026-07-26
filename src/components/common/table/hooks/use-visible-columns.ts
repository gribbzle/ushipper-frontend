import { useMemo } from 'react';

import { TableProps } from '../table.types';

export const useVisibleColumns = <T>({ columns }: Pick<TableProps<T>, 'columns'>) => {
    const visibleColumns = useMemo(() => columns.filter(column => !column.hide), [columns]);

    return { visibleColumns };
};
