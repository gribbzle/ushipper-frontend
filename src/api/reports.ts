import { AxiosError } from 'axios';

import { axios } from '@utils';

export type ReportParams = {
    accountId: string;
    startDate?: string;
    endDate?: string;
};

const fetchReport = async (url: string, { accountId, startDate, endDate }: ReportParams) => {
    try {
        const response = await axios.get(url, {
            params: { accountId, startDate, endDate },
            responseType: 'blob',
        });

        const blob = response.request.response;
        const fileUrl = URL.createObjectURL(blob);

        return fileUrl;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data instanceof Blob) {
            try {
                const errorText = await error.response.data.text();
                const errorObject = JSON.parse(errorText);

                throw errorObject;
            } catch (parseError) {
                throw parseError;
            }
        } else {
            const errorMessage = (error as Error).message;

            throw new Error(errorMessage);
        }
    }
};

export const fetchDriverStatementReportV1 = (params: ReportParams) => {
    return fetchReport('/api/reports/driver-statement', params);
};

export const fetchDriverStatementReportV2 = (params: ReportParams) => {
    return fetchReport('/api/reports/driver-statement-v2', params);
};

export const fetchAccountBalanceTransactionsReport = (params: ReportParams) => {
    return fetchReport('/api/reports/account-balance-transactions', params);
};

export const fetchCashOutDriverStatementTransactionsReport = (params: ReportParams) => {
    return fetchReport('/api/reports/cashout-driver-statement', params);
};
