import { toast } from 'react-toastify';

import { RequestError } from '@/shared';
import { translateByNamespace } from '@/utils/i18n';
const t = translateByNamespace('common:notifications');

export default function parseAndShowAxiosError(error: RequestError | Record<string, any>, defaultErrorText = '') {
    let message = defaultErrorText || t('default-error-notification');

    if (error?.data?.message) {
        message = error?.data?.message;
    }

    toast.error(message);
}
