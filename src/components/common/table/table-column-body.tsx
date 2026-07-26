import React, { ReactNode } from 'react';

import { useStickyColumnOffsets } from './hooks';
import { TableColumnBodyProps } from './table.types';
import { getAdjustedShadows, getStickyClassNames, getStickyColumnsState } from './utils';

export const defaultCellRender: <T extends Record<string, unknown>>(row: T) => ReactNode = ({ value }) => value as ReactNode;

export const TableColumnBody = <T extends Record<string, unknown>>({
    columns,
    row,
    styles,
    showLeftShadow = false,
    showRightShadow = false,
    enableStickyColumns = true,
    stickyLeftColumns = 1,
    stickyRightColumns = 1,
    onOpenCollapse,
}: TableColumnBodyProps<T>) => {
    const { columnRefs, offsets } = useStickyColumnOffsets({
        columns,
        stickyLeftColumns,
        stickyRightColumns,
    });

    return (
        <>
            {columns.map((column, index) => {
                const { isStickyLeft, isStickyRight } = getStickyColumnsState({
                    index,
                    totalColumns: columns.length,
                    stickyLeftColumns,
                    stickyRightColumns,
                    enableStickyColumns,
                });

                const { isLeftShadow, isRightShadow } = getAdjustedShadows({
                    index,
                    totalColumns: columns.length,
                    stickyLeftColumns,
                    stickyRightColumns,
                    showLeftShadow,
                    showRightShadow,
                });

                const classNames = [
                    column.cellClassName,
                    column.key,
                    getStickyClassNames({
                        isStickyLeft,
                        isStickyRight,
                        isLeftShadow,
                        isRightShadow,
                    }),
                ]
                    .filter(Boolean)
                    .join(' ');

                return (
                    <td
                        key={column.key}
                        ref={el => (columnRefs.current[index] = el)}
                        className={classNames}
                        style={{
                            ...(index === 0 ? styles : {}),
                            left: isStickyLeft ? `${offsets.left[index]}px` : undefined,
                            right: isStickyRight ? `${offsets.right[columns.length - 1 - index]}px` : undefined,
                        }}
                    >
                        {(column.cellRender || defaultCellRender)({ value: row[column.key], row, onOpenCollapse })}
                    </td>
                );
            })}
        </>
    );
};
