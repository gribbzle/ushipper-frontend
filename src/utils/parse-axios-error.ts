import { toast } from 'react-toastify';

import { translateByNamespace } from '@/utils/i18n';

type RequestError = {
    status: number;
    data: {
        message: string;
    };
};

const t = translateByNamespace('common:notifications');

export default function parseAndShowAxiosError(error: RequestError | Record<string, any>, defaultErrorText = '') {
    let message = defaultErrorText || t('default-error-notification');

    if (error?.data?.message) {
        message = error?.data?.message;
    }

    toast.error(message);
}
