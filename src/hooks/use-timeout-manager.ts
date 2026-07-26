import { useCallback, useEffect, useRef } from 'react';

export const useTimeoutManager = () => {
    const timeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

    const setTimer = useCallback((key: string, callback: () => void, delay = 500) => {
        if (timeoutsRef.current.has(key)) {
            clearTimeout(timeoutsRef.current.get(key));
        }

        const timeoutId = setTimeout(() => {
            if (timeoutsRef.current.has(key)) {
                timeoutsRef.current.delete(key);
            }

            callback();
        }, delay);

        timeoutsRef.current.set(key, timeoutId);
    }, []);

    useEffect(() => {
        const timeouts = timeoutsRef.current;

        return () => {
            timeouts.forEach(clearTimeout);
            timeouts.clear();
        };
    }, []);

    return setTimer;
};
