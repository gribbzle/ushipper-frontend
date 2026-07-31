import { format } from 'date-fns';
import { toSnakeCase } from 'js-convert-case';
import { toast } from 'react-toastify';

import { GetOrdersData } from '@store/api/orders-api';
import { translateByNamespace } from '@utils/i18n';

import { useTextFileDownloader } from '../useDownload';

const t = translateByNamespace('admin:orders-page:notifications');

export const useOrdersExport = () => {
    const download = useTextFileDownloader();

    const exportOrders = async (params: GetOrdersData) => {
        try {
            const filename = `orders-${format(new Date(), 'dd.MM.yyyy-HH:mm')}.csv`;

            const queryString = Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .flatMap(([key, value]) =>
                    (Array.isArray(value) ? value : [value]).map(item => `${toSnakeCase(key)}${Array.isArray(value) ? '[]' : ''}=${encodeURIComponent(item)}`),
                )
                .join('&');

            const url = `/api/orders?x-response-format=csv&${queryString}`;

            await download(url, filename);
        } catch (err) {
            toast.error<string>(t('export-orders-error'));
        }
    };

    return exportOrders;
};
