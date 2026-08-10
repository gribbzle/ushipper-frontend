import React, { MouseEvent } from 'react';

import { OrderSortingName } from '@/enums/order-sorting-name';

export type ClickedRowId = number | string | null;

export type TableColumn<T> = {
    key: string;
    name: React.ReactNode;
    isSortable?: boolean;
    cellClassName?: string;
    hide?: boolean;
    headerCellClassName?: string;
    cellRender?: (arg: { value: any; row: T; onOpenCollapse?: (e: MouseEvent) => void }) => React.ReactNode;
};

export type TablePaginationProps = {
    page: number;
    lastPage?: number | null;
    perPage?: number;
    from?: number;
    to?: number;
    total?: number;
    onPageChange: (page: number) => void;
    onChangePerPage: (perPage: number) => void;
};

export type TableProps<T> = {
    className?: string;
    columns: TableColumn<T>[];
    data: T[];
    isSelectable?: boolean;
    isThead?: boolean;
    isSticky?: boolean;
    onSelect?: (ids: string[]) => void;
    isRowClickable?: (row: T) => boolean;
    highlightClickedRow?: boolean;
    onRowClick?: (row: T) => void;
    clickedRowId?: ClickedRowId;
    orderName?: OrderSortingName | string | null;
    orderDirection?: string | null;
    onOrderChange?: (orderName: string, orderDirection: string) => void;
    paginationProps?: TablePaginationProps;
    stickyColumnsProps?: Pick<SharedTableColumnProps, 'stickyLeftColumns' | 'stickyRightColumns'>;
};

type SharedTableColumnProps = {
    showRightShadow?: boolean;
    showLeftShadow?: boolean;
    enableStickyColumns?: boolean;
    stickyLeftColumns?: number;
    stickyRightColumns?: number;
};

export type TableColumnHeadersProps<T> = Pick<TableProps<T>, 'columns' | 'orderDirection' | 'orderName' | 'onOrderChange'> & {
    visibleColumns: TableColumn<T>[];
} & SharedTableColumnProps;

export type TableColumnBodyProps<T> = Pick<TableProps<T>, 'columns'> & {
    row: T;
    styles?: any;
    onOpenCollapse?: (e: MouseEvent) => void;
} & SharedTableColumnProps;

export type TableComponent = <T extends Record<string, unknown>>(props: TableProps<T>) => React.ReactElement;

export type LoadDataFunction<T> = (rowId: string) => Promise<T[]>;
