import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const useRouterForAccountChange = () => {
    const router = useRouter();

    const redirectToStartPage = useCallback(
        async (isMeDispatcher: boolean) => {
            const path = `/client/${isMeDispatcher ? 'dashboard' : 'orders'}`;

            const asPath = `/${isMeDispatcher ? 'dashboard' : 'orders'}`;

            await router.push(path, asPath);
        },
        [router],
    );

    return {
        redirectToStartPage,
    };
};
