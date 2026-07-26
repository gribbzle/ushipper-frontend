import { useEffect, useRef, useState } from 'react';

const useElementSize = (offsetWidth = 0, offsetHeight = 0) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) {
            return;
        }

        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setSize({
                    width: entry.contentRect.width + offsetWidth,
                    height: entry.contentRect.height + offsetHeight,
                });
            });
        });

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [offsetHeight, offsetWidth]);

    return { elementRef, size };
};

export default useElementSize;
