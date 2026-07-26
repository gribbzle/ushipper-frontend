import { useEffect, useRef } from 'react';

export const useEffectOnce: typeof useEffect = (effect, deps) => {
    const isEffectCalled = useRef<boolean>(false);

    useEffect(() => {
        let cleanup: ReturnType<typeof effect> | undefined;

        if (!isEffectCalled.current) {
            isEffectCalled.current = true;
            cleanup = effect();
        }

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [deps, effect]);
};
