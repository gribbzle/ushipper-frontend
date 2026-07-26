import { MouseEvent, useCallback, useState } from 'react';

export const useOpenTableCollapse = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleCollapse = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prevState => !prevState);
    }, []);

    return { toggleCollapse, isOpen };
};
