import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const usePagination = () => {
    const router = useRouter();

    const onPageChangeHandler = useCallback(
        (page: number) => {
            router.replace({ pathname: router.pathname, query: { ...router.query, page } });
        },
        [router],
    );

    return { onPageChangeHandler };
};
