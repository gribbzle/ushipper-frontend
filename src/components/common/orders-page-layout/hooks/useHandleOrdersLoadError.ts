import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:orders-page:notifications');

export const useHandleOrdersLoadError = (isError?: boolean) => {
    useEffect(() => {
        if (isError) {
            toast.error<string>(t('load-orders-error'));
        }
    }, [isError]);
};
