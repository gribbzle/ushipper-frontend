import { useCallback, useEffect } from 'react';

const useOutsideCLick = (ref: any, callback: (clickOutside: boolean) => void, parentRef?: any) => {
    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            if (ref.current?.contains(e.target) || (parentRef?.current && parentRef.current.contains(e.target))) {
                callback(false);
            } else {
                callback(true);
            }
        },
        [ref, parentRef, callback],
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
};

export default useOutsideCLick;
