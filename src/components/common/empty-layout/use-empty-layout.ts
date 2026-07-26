import { useRouter } from 'next/router';

import { useMeCarrier, useMeShipper } from '@hooks';

export const useEmptyLayout = (pathTo: string | undefined, asPathTo: string | undefined) => {
    const router = useRouter();

    const onClickHandler = async () => {
        if (pathTo) {
            await router.push(pathTo, asPathTo);
        }
    };

    const isShipper = useMeShipper();
    const isCarrier = useMeCarrier();

    return { isShipper, isCarrier, onClickHandler };
};
