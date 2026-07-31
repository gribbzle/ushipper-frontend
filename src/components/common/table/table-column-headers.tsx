import React from 'react';

import { classname } from '@utils/classname';

import ArrowDownIcon from './arrow-down.svg';
import { useOnOrderChangeHandler, useStickyColumnOffsets } from './hooks';
import { TableColumnHeadersProps } from './table.types';
import { getAdjustedShadows, getStickyClassNames, getStickyColumnsState } from './utils';

import './table.scss';

const cn = classname('table');

export const TableColumnHeaders = <T extends Record<string, unknown>>({
    columns,
    orderDirection,
    orderName,
    visibleColumns,
    showRightShadow = false,
    showLeftShadow = false,
    enableStickyColumns = true,
    stickyLeftColumns = 1,
    stickyRightColumns = 1,
    onOrderChange,
}: TableColumnHeadersProps<T>) => {
    const { onOrderChangeHandler } = useOnOrderChangeHandler({
        columns,
        orderDirection,
        onOrderChange,
    });

    const { columnRefs, offsets } = useStickyColumnOffsets({
        columns: visibleColumns,
        stickyLeftColumns,
        stickyRightColumns,
    });

    return (
        <>
            {visibleColumns.map(({ key, name, isSortable, headerCellClassName }, index) => {
                const isColumnSorted = orderName === key;

                const { isStickyLeft, isStickyRight } = getStickyColumnsState({
                    index,
                    totalColumns: visibleColumns.length,
                    stickyLeftColumns,
                    stickyRightColumns,
                    enableStickyColumns,
                });

                const { isLeftShadow, isRightShadow } = getAdjustedShadows({
                    index,
                    totalColumns: visibleColumns.length,
                    stickyLeftColumns,
                    stickyRightColumns,
                    showLeftShadow,
                    showRightShadow,
                });

                const stickyClassNames = getStickyClassNames({
                    isStickyLeft,
                    isStickyRight,
                    isLeftShadow,
                    isRightShadow,
                });

                return (
                    <td
                        key={key}
                        ref={el => (columnRefs.current[index] = el)}
                        className={cn('header-cell', { sortable: isSortable, sorted: isColumnSorted }, [headerCellClassName, stickyClassNames])}
                        style={{
                            left: isStickyLeft ? `${offsets.left[index]}px` : undefined,
                            right: isStickyRight ? `${offsets.right[visibleColumns.length - 1 - index]}px` : undefined,
                        }}
                        onClick={() => onOrderChangeHandler(key)}
                    >
                        {name}
                        {isColumnSorted && (
                            <div className={cn('sort', { sort: isColumnSorted && (orderDirection as string) })}>
                                <ArrowDownIcon />
                            </div>
                        )}
                    </td>
                );
            })}
        </>
    );
};
