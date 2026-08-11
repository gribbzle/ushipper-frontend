import { useCallback } from 'react';
import { format } from 'date-fns';
import { toSnakeCase } from 'js-convert-case';
import JsCookie from 'js-cookie';
import { toast } from 'react-toastify';

import { BalanceType } from '@/enums/balance-type';
import { Attachment } from '@/shared';
import { TransactionsFiltersState } from '@/types/transactions';
import { translateByNamespace } from '@utils/i18n';

const tExternalContract = translateByNamespace('client:loadboard:notifications');

export default function useFileDownloader() {
    return useCallback(async (url: string, filename: string, type: 'blob' | 'text' = 'blob') => {
        try {
            const response = await fetch(url, {
                method: 'get',
                headers: new Headers({
                    Authorization: JsCookie.get('Authorization') || '',
                }),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            let blob;

            if (type === 'text') {
                const textData = await response.text();

                blob = new Blob([textData], { type: 'text/csv' });
            } else {
                blob = await response.blob();
            }
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = downloadUrl;
            link.download = filename || 'downloaded-file';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        } finally {
        }
    }, []);
}

export const useDownloadAttachment = () => {
    const download = useFileDownloader();

    const downloadAttachment = async (attachment: Attachment) => {
        download(`/api/attachments/${attachment.publicId}/content`, attachment.name);
    };

    return { downloadAttachment };
};

export const useDownloadExternalContract = () => {
    const download = useFileDownloader();

    const downloadExternalContract = async ({ publicOrderId, externalOrderId }: { publicOrderId: string; externalOrderId: string }) => {
        try {
            const filename = `CD-Contract-${format(new Date(), 'dd.MM.yyyy-HH.mm')}.pdf`;

            await download(`/api/orders/${publicOrderId}/external-orders/${externalOrderId}/contract`, filename);
        } catch {
            toast.error<string>(tExternalContract('not-found-contract-error-notification'));
        }
    };

    return downloadExternalContract;
};

export const useTextFileDownloader = () => {
    const download = useFileDownloader();

    return useCallback(
        async (url: string, filename: string) => {
            await download(url, filename, 'text');
        },
        [download],
    );
};

type ExportTransactionsProps = Partial<TransactionsFiltersState> & {
    balanceId?: string;
    balanceType?: BalanceType;
};

const translateExportError = translateByNamespace('admin:accounting:notifications');

export const useExportTransactions = () => {
    const download = useTextFileDownloader();

    const exportTransactions = async ({ balanceType, balanceId, ...others }: ExportTransactionsProps) => {
        try {
            const filename = `${balanceType ?? balanceId ?? 'transactions'}-${format(new Date(), 'dd.MM.yyyy-HH.mm')}.csv`;

            const params = {
                balanceType,
                balanceId,
                ...others,
            };

            const queryString = Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${toSnakeCase(key)}=${encodeURIComponent(value as string)}`)
                .join('&');

            const url = `/api/transactions?x-response-format=csv&${queryString}`;

            await download(url, filename);
        } catch {
            toast.error<string>(translateExportError('export-transactions-error'));
        }
    };

    return exportTransactions;
};
