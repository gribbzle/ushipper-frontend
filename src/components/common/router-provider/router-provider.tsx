import React from 'react';
import { createContext, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';

import usePrevRoute from '@/hooks/usePrevRoute';

type RouterContext = {
    prevRouter: NextRouter | null;
    // clearRouterHistory: () => void;
    // routesHistory: Array<NextRouter>;
};
export const RouterContext = createContext<RouterContext>({
    prevRouter: null,
    // clearRouterHistory: () => {},
    // routesHistory: [],
});

export default function RouterProvider({ children }: PropsWithChildren) {
    const prevRouter = usePrevRoute();
    // const router = useRouter();

    // const routesHistory = useRef<Array<NextRouter>>([]);
    //
    // useEffect(() => {
    //     routesHistory.current = [...routesHistory.current, router];
    // }, [router]);
    //
    // const clearRouterHistory = useCallback(() => {
    //     routesHistory.current = [];
    // }, []);

    return (
        <RouterContext.Provider
            value={{
                prevRouter: prevRouter,
                // clearRouterHistory,
                // routesHistory: routesHistory.current,
            }}
        >
            {children}
        </RouterContext.Provider>
    );
}
