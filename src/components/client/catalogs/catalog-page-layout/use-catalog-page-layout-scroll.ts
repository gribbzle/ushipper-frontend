import { useEffect } from 'react';

export const useCatalogPageLayoutScroll = (currentPage: number) => {
    useEffect(() => {
        const mainLayoutBody = document.querySelector('.main-layout__body') as Element;

        mainLayoutBody.scrollTop = 0;
    }, [currentPage]);
};
