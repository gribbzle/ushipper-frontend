import { useEffect } from 'react';

export const useScrollToOrdersPage = (selector: string, dependency?: unknown) => {
    useEffect(() => {
        const element = document.querySelector(selector) as Element;

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependency]);
};
