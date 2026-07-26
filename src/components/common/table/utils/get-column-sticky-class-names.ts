import { classname } from '@utils';

const cn = classname('table');

/**
 * Returns a string of classes for sticky columns.
 *
 * @param isStickyLeft - Flag indicating if the column is sticky on the left.
 * @param isStickyRight - Flag indicating if the column is sticky on the right.
 * @param isLeftShadow - Flag indicating if a shadow should be added on the left.
 * @param isRightShadow - Flag indicating if a shadow should be added on the right.
 * @returns A string of classes for the sticky column.
 */

export const getStickyClassNames = ({
    isStickyLeft,
    isStickyRight,
    isLeftShadow,
    isRightShadow,
}: {
    isStickyLeft: boolean;
    isStickyRight: boolean;
    isLeftShadow: boolean;
    isRightShadow: boolean;
}): string => {
    return [
        isStickyLeft && cn('column--sticky-left'),
        isStickyRight && cn('column--sticky-right'),
        isStickyLeft && isLeftShadow && cn('column--shadow-left'),
        isStickyRight && isRightShadow && cn('column--shadow-right'),
    ]
        .filter(Boolean)
        .join(' ');
};

export const getStickyColumnsState = ({
    index,
    totalColumns,
    stickyLeftColumns,
    stickyRightColumns,
    enableStickyColumns,
}: {
    index: number;
    totalColumns: number;
    stickyLeftColumns: number;
    stickyRightColumns: number;
    enableStickyColumns: boolean;
}): {
    isStickyLeft: boolean;
    isStickyRight: boolean;
} => {
    if (!enableStickyColumns) {
        return { isStickyLeft: false, isStickyRight: false };
    }

    return {
        isStickyLeft: index < stickyLeftColumns && enableStickyColumns,
        isStickyRight: index >= totalColumns - stickyRightColumns && enableStickyColumns,
    };
};

export const getAdjustedShadows = ({
    index,
    totalColumns,
    stickyLeftColumns,
    stickyRightColumns,
    showRightShadow,
    showLeftShadow,
}: {
    index: number;
    totalColumns: number;
    stickyLeftColumns: number;
    stickyRightColumns: number;
    showRightShadow: boolean;
    showLeftShadow: boolean;
}): {
    isLeftShadow: boolean;
    isRightShadow: boolean;
} => {
    return {
        isLeftShadow: showLeftShadow && index === stickyLeftColumns - 1,
        isRightShadow: showRightShadow && index === totalColumns - stickyRightColumns,
    };
};
