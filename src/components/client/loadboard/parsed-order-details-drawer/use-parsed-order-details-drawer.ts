import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { getOrderId } from '@/utils/order';
import { useGetLoadboardItemQuery } from '@store/api/loadboard-api';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:loadboard:request-drawer');
const tOrderDetails = translateByNamespace('client:loadboard:load-details');

export const useParsedOrderDetailsDrawer = () => {
    const router = useRouter();
    const { push, query, pathname, asPath } = router;
    const { drawerParsedOrderId, ...restQuery } = query;

    const onDrawerClose = useCallback(async () => {
        const baseAsPath = asPath.split('?')[0];

        await push({ pathname, query: restQuery }, { pathname: baseAsPath, query: restQuery });
    }, [push, pathname, asPath, restQuery]);

    const { data: order, isSuccess, isError } = useGetLoadboardItemQuery(drawerParsedOrderId as string, { skip: !drawerParsedOrderId });

    const opened = useMemo((): boolean => !!drawerParsedOrderId && (isSuccess || isError), [isSuccess, isError, drawerParsedOrderId]);

    const title = useMemo(
        (): string =>
            order
                ? t('title-3', {
                      orderId: getOrderId(order),
                      brokerCompanyName: order?.customerInformation?.customerName ?? '',
                  })
                : tOrderDetails('title'),
        [order],
    );

    return { onDrawerClose, opened, order, title };
};
