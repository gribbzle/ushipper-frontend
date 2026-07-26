import { ReactElement } from 'react';

export type CatalogListProps<T> = {
    items: T[];
    CatalogItem: (props: { info: T }) => ReactElement;
};
