import { useMemo } from 'react';

import { useAppSelector } from '@store';
import { orderSelector } from '@store/client';

import { useMeAdmin, useMeDriverRelated } from '../use-user-role-group';

export const useCanManageOrder = () => {
    const isDriver = useMeDriverRelated();
    const isAdminPage = useMeAdmin();
    const order = useAppSelector(orderSelector);

    return useMemo(() => !!order && !order.deletedAt && !(isAdminPage || isDriver), [order, isAdminPage, isDriver]);
};
