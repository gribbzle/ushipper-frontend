import { ReactElement } from 'react';

export type CatalogPageLayoutProps<T, S> = {
    items?: T[];
    isResponseSuccess: boolean;
    lastPage?: number;
    catalogStats: S;
    renderCatalogListComponent: (items: T[]) => ReactElement;
    emptyTitle: string;
};
