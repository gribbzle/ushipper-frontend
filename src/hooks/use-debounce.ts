import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'debounce';

export const useDebounce = (callback: () => void) => {
    const ref = useRef<any>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    return useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 600);
    }, []);
};
