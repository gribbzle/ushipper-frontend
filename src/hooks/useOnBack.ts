import { useCallback, useContext } from 'react';
import Router from 'next/router';

import { RouterContext } from '@/components/common/router-provider/router-provider';

export const useOnBack = (redirectWithoutPrevRouter?: () => Promise<void>) => {
    const { prevRouter } = useContext(RouterContext);

    return useCallback(async () => {
        if (prevRouter) {
            await Router.push(
                {
                    pathname: prevRouter.pathname,
                    query: prevRouter.query,
                },
                prevRouter.asPath,
            );
        } else if (redirectWithoutPrevRouter) {
            await redirectWithoutPrevRouter();
        }
    }, [prevRouter, redirectWithoutPrevRouter]);
};
