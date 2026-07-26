import { ReactElement } from 'react';

import { Load } from '@store/client';

export type OrderListLayoutProps = {
    renderOrdersListComponent: (orders: Load[]) => ReactElement;
    requestsPageContext?: boolean;
    emptyListTitle?: string;
    hideBtnInEmptyList?: boolean;
};
