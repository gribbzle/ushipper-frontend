import { ReactNode } from 'react';

export type AccountTransactionsBlockProps = {
    subTitle?: ReactNode;
    title?: string;
    children: ReactNode;
    showViewAllButton: boolean;
    displayAddTransaction?: boolean;
};
