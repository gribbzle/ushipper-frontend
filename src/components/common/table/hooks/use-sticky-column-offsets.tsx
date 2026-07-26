import { useEffect, useRef, useState } from 'react';

type useStickyColumnOffsetsProps = {
    columns: { key: string }[];
    stickyLeftColumns: number;
    stickyRightColumns: number;
};

export const useStickyColumnOffsets = ({ columns, stickyLeftColumns, stickyRightColumns }: useStickyColumnOffsetsProps) => {
    const columnRefs = useRef<(HTMLTableCellElement | null)[]>([]);
    const [offsets, setOffsets] = useState<{ left: number[]; right: number[] }>({ left: [], right: [] });

    useEffect(() => {
        if (!columnRefs.current.length) return;

        const leftOffsets: number[] = [];
        const rightOffsets: number[] = [];

        let leftPosition = 0;
        let rightPosition = 0;

        for (let i = 0; i < stickyLeftColumns; i++) {
            const column = columnRefs.current[i];

            if (column) {
                leftOffsets[i] = leftPosition;
                leftPosition += column.getBoundingClientRect().width;
            }
        }

        for (let i = columns.length - 1; i >= columns.length - stickyRightColumns; i--) {
            const column = columnRefs.current[i];

            if (column) {
                rightOffsets[columns.length - 1 - i] = rightPosition;
                rightPosition += column.getBoundingClientRect().width;
            }
        }

        setOffsets({ left: leftOffsets, right: rightOffsets });
    }, [columns, stickyLeftColumns, stickyRightColumns]);

    return { columnRefs, offsets };
};
