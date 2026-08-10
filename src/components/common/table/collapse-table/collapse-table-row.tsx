import React, { MouseEvent, useCallback } from 'react';

import { User } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Button } from '../../button';
import { useGetUsersWithCursorPagination, useOpenTableCollapse } from '../hooks';
import { TableColumn, TableProps } from '../table.types';
import { TableColumnBody } from '../table-column-body';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';
import MinusCircleIcon from '@/assets/icons/minus-circle-icon.svg';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

const COLLAPSE_ICON_SIZE = 24;

const cn = classname('table');
const tCursor = translateByNamespace('client:staff-page');

export const CollapseTableRow = ({
    user,
    visibleColumns,
    // oxc-disable-next-line only-used-in-recursion
    isRowClickable,
    onRowClick,
    // oxc-disable-next-line only-used-in-recursion
    clickedRowId,
    isCollapseBodyRow,
    level = 0,
}: Pick<TableProps<User>, 'isRowClickable' | 'onRowClick' | 'clickedRowId' | 'onOrderChange'> & {
    visibleColumns: TableColumn<User>[];
    user: User;
    isCollapseBodyRow?: boolean;
    level?: number;
}) => {
    const transformStyle = isCollapseBodyRow ? { transform: `translateX(${COLLAPSE_ICON_SIZE * level}px)` } : {};
    const { toggleCollapse, isOpen } = useOpenTableCollapse();
    const { handleShowMoreUsers, setCursor, usersData, nextCursor } = useGetUsersWithCursorPagination(user, !isOpen);

    const handleToggleCollapse = useCallback(
        (e: MouseEvent) => {
            if (user.hasSubordinates) {
                toggleCollapse(e);
                if (!isOpen) {
                    setCursor('');
                }
            }
        },
        [toggleCollapse, setCursor, user.hasSubordinates, isOpen],
    );

    const renderCollapseIcon = () => {
        return (
            <td className={cn('collapse-icon', { open: isOpen, empty: !user.hasSubordinates })} style={transformStyle} onClick={handleToggleCollapse}>
                <span className='vertical'></span>
                <span className={`horizontal ${user.hasSubordinates ? 'short' : 'long'}`}></span>
                <span
                    className={cn('icon')}
                    style={{
                        visibility: user.hasSubordinates ? 'visible' : 'hidden',
                    }}
                >
                    {isOpen ? <MinusCircleIcon /> : <PlusCircleIcon />}
                </span>
            </td>
        );
    };

    return (
        <>
          <tr className={cn('row', { clickable: true, clicked: false, collapse: isCollapseBodyRow })} onClick={() => onRowClick?.(user)}>
                {renderCollapseIcon()}
                <TableColumnBody onOpenCollapse={toggleCollapse} row={user} columns={visibleColumns} styles={transformStyle} enableStickyColumns={false} />
            </tr>
            {isOpen && !!usersData.length ? (
                <tr>
                    <td className={cn('collapse-content')} colSpan={visibleColumns.length + 1}>
                        <table className={cn('', [cn('collapse')])}>
                            <tbody>
                                {usersData.map(user => (
                                    <CollapseTableRow
                                        key={user.publicId}
                                        user={user}
                                        visibleColumns={visibleColumns}
                                        isRowClickable={isRowClickable}
                                        onRowClick={onRowClick}
                                        clickedRowId={clickedRowId}
                                        isCollapseBodyRow={true}
                                        level={level + 1}
                                    />
                                ))}
                                {nextCursor && (
                                    <tr className={cn('show-more')}>
                                        <td colSpan={visibleColumns.length + 1}>
                                            <Button view='link' active={true} size='mini' onClick={handleShowMoreUsers}>
                                                <ArrowDownIcon /> {tCursor('show-more-button-label', { name: user.name })}
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </td>
                </tr>
            ) : null}
        </>
    );
};
