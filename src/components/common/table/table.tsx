import React, { useCallback, useEffect, useRef, useState } from 'react';

import { classname } from '@utils/classname';

import { Checkbox } from '../checkbox';

import { getId } from './get-row-id';
import { useSelectRowHandler, useVisibleColumns } from './hooks';
import { TableComponent } from './table.types';
import { TableColumnBody } from './table-column-body';
import { TableColumnHeaders } from './table-column-headers';
import { TablePagination } from './table-pagination';

import './table.scss';

const OFFSET = 24;
const PAGINATION_HEIGHT = 48;

const cn = classname('table');

export const Table: TableComponent = ({
    columns = [],
    data = [],
    isSelectable,
    onSelect,
    isRowClickable,
    onRowClick,
    clickedRowId = null,
    orderName,
    orderDirection,
    onOrderChange,
    className,
    isThead = true,
    isSticky = false,
    paginationProps,
    stickyColumnsProps,
}) => {
    const { selectRowHandler, selectedIds } = useSelectRowHandler({ data, onSelect });
    const { visibleColumns } = useVisibleColumns({ columns });
    const containerRef = useRef<HTMLDivElement>(null);

    const [showLeftShadow, setShowLeftShadow] = useState(false);
    const [showRightShadow, setShowRightShadow] = useState(false);
    const [containerHeight, setContainerHeight] = useState<string | undefined>(undefined);

    const updateHeight = useCallback(() => {
        if (!containerRef.current) {
            return;
        }

        const viewportHeight = window.innerHeight;
        const containerRect = containerRef.current.getBoundingClientRect();

        const availableHeight = viewportHeight - containerRect.top - OFFSET - (paginationProps?.lastPage ? PAGINATION_HEIGHT : 0);

        setContainerHeight(`${availableHeight}px`);
    }, [paginationProps?.lastPage]);

    useEffect(() => {
        updateHeight();

        window.addEventListener('resize', updateHeight);

        return () => window.removeEventListener('resize', updateHeight);
    }, [paginationProps, updateHeight]);

    const handleScroll = useCallback(() => {
        if (containerRef?.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

            setShowLeftShadow(scrollLeft > 0);
            setShowRightShadow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    }, []);

    useEffect(() => {
        const container = containerRef?.current;

        container?.addEventListener('scroll', handleScroll);

        return () => container?.removeEventListener('scroll', handleScroll);
    }, [containerRef, handleScroll]);

    return (
        <div>
            <div
                style={{ maxHeight: containerHeight }}
                className={cn('container', [paginationProps?.lastPage ? 'with-pagination' : undefined])}
                ref={containerRef}
            >
                <table className={cn('', { sticky: isSticky }, [className])}>
                    {isThead && (
                        <thead>
                            <tr>
                                {isSelectable && (
                                    <td className={cn('checkbox')}>
                                        <Checkbox
                                            size='mini'
                                            checked={data.length !== 0 && selectedIds.length === data.length}
                                            onChange={() => selectRowHandler(null)}
                                        />
                                    </td>
                                )}
                                <TableColumnHeaders
                                    columns={columns}
                                    orderName={orderName}
                                    orderDirection={orderDirection}
                                    onOrderChange={onOrderChange}
                                    visibleColumns={visibleColumns}
                                    showLeftShadow={showLeftShadow}
                                    showRightShadow={showRightShadow}
                                    {...stickyColumnsProps}
                                />
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {data &&
                            data.length !== 0 &&
                            data.map(row => {
                                const isClickedRow = clickedRowId === getId(row);

                                return (
                                    <tr
                                        key={`row-${row.id || row.publicId}`}
                                        className={cn('row', { clickable: isRowClickable?.(row) || false, clicked: isClickedRow })}
                                        onClick={() => {
                                            if (isRowClickable?.(row)) {
                                                onRowClick?.(row);
                                            }
                                        }}
                                    >
                                        {isSelectable && (
                                            <td className={cn('checkbox')}>
                                                <Checkbox
                                                    size='mini'
                                                    checked={selectedIds.includes(getId(row))}
                                                    onChange={() => selectRowHandler(getId(row))}
                                                />
                                            </td>
                                        )}
                                        <TableColumnBody
                                            row={row}
                                            columns={visibleColumns}
                                            showLeftShadow={showLeftShadow}
                                            showRightShadow={showRightShadow}
                                            {...stickyColumnsProps}
                                        />
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            {paginationProps && <TablePagination {...paginationProps} />}
        </div>
    );
};
