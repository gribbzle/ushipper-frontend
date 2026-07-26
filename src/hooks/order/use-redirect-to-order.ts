import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

type Props = {
    publicId?: string;
};

export const useRedirectToOrder = ({ publicId }: Props) => {
    const router = useRouter();

    const ordersPath = useMemo(() => {
        let path = '/client/orders';

        if (publicId) {
            path = `${path}/${publicId}`;
        }

        return path;
    }, [publicId]);

    const asOrdersPath = useMemo(() => {
        let path = '/orders';

        if (publicId) {
            path = `${path}/${publicId}`;
        }

        return path;
    }, [publicId]);

    const redirectToOrders = useCallback(async () => {
        await router.push(ordersPath, asOrdersPath);
    }, [ordersPath, asOrdersPath, router]);

    return {
        redirectToOrders,
    };
};
