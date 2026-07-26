import { useCallback, useRef, useState } from 'react';

export const useHover = <T extends HTMLElement>(): [(node: T) => void, boolean] => {
    const [isHovered, setIsHovered] = useState(false);
    const nodeRef = useRef<T | null>(null);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const callbackRef = useCallback(
        (node: T | null) => {
            if (nodeRef.current) {
                nodeRef.current.removeEventListener('mouseenter', handleMouseEnter);
                nodeRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }

            if (node) {
                node.addEventListener('mouseenter', handleMouseEnter);
                node.addEventListener('mouseleave', handleMouseLeave);
            }

            nodeRef.current = node;
        },
        [handleMouseEnter, handleMouseLeave],
    );

    return [callbackRef, isHovered];
};
