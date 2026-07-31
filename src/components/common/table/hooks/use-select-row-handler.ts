import { useCallback, useEffect, useState } from 'react';

import { getId } from '../get-row-id';
import { TableProps } from '../table.types';

export const useSelectRowHandler = <T extends Record<string, unknown>>({ data, onSelect }: Pick<TableProps<T>, 'data' | 'onSelect'>) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const selectRowHandler = useCallback(
        (id: string | null) => {
            if (id === null) {
                if (selectedIds.length === data.length) {
                    setSelectedIds([]);
                } else {
                    setSelectedIds(data.map(row => getId(row)));
                }

                return;
            }

            if (selectedIds.includes(id)) {
                setSelectedIds(selectedIds.filter(x => x !== id));
            } else {
                setSelectedIds([...selectedIds, id]);
            }
        },
        [data, selectedIds],
    );

    useEffect(() => {
        onSelect?.(selectedIds);
    }, [onSelect, selectedIds]);

    return { selectRowHandler, selectedIds };
};
