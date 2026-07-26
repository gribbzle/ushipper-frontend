import { useCallback } from 'react';
import has from 'has-values';

export const useOrdersFiltersChange = <T extends object>(onFiltersChange: (values: T) => void) =>
    useCallback(
        (values: T) => {
            if (!has(values)) {
                return;
            }

            onFiltersChange(values);
        },
        [onFiltersChange],
    );
