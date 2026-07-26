import { useCallback, useMemo, useRef, useState } from 'react';
import { format, isAfter } from 'date-fns';
import { FormApi } from 'final-form';
import { toSnakeCase } from 'js-convert-case';

import {
    fetchAccountBalanceTransactionsReport,
    fetchCashOutDriverStatementTransactionsReport,
    fetchDriverStatementReportV1,
    fetchDriverStatementReportV2,
    ReportParams,
} from '@/api/reports';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, reportPopupPropsSelector, ReportType } from '@store/admin';
import { downloadFileUsingAnchorElement, translateByNamespace } from '@utils';

import { ReportFormValue } from './report-popup';

const tVal = translateByNamespace('common:validators');
const t = translateByNamespace('admin:accounting:owners-and-drivers:report-popup');

export const validateDateOrder = ({ startDate, endDate }: ReportFormValue) => {
    const errors: Partial<ReportFormValue> = {};

    if (!startDate || !endDate) {
        return undefined;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        errors.startDate = tVal('invalid-date');
        errors.endDate = tVal('invalid-date');

        return errors;
    }

    if (isAfter(parsedStartDate, parsedEndDate)) {
        errors.endDate = tVal('end-date-must-be-after-start-date');
    }

    return Object.keys(errors).length ? errors : undefined;
};

type ReportContext = {
    fetcher: (params: ReportParams) => Promise<string>;
    titleKey: string;
    initialValues: Partial<ReportFormValue>;
    validate?: (values: ReportFormValue) => Partial<ReportFormValue> | undefined;
};

const reportContextMapping: Map<ReportType, ReportContext> = new Map([
    [
        'statementV1',
        {
            fetcher: fetchDriverStatementReportV1,
            titleKey: 'statement-v1-title',
            initialValues: {},
            validate: validateDateOrder,
        },
    ],
    [
        'statementV2',
        {
            fetcher: fetchDriverStatementReportV2,
            titleKey: 'statement-v2-title',
            initialValues: {},
            validate: validateDateOrder,
        },
    ],
    [
        'balance',
        {
            fetcher: fetchAccountBalanceTransactionsReport,
            titleKey: 'balance-title',
            initialValues: {},
            validate: validateDateOrder,
        },
    ],
    [
        'cashout',
        {
            fetcher: fetchCashOutDriverStatementTransactionsReport,
            titleKey: 'cashout-title',
            initialValues: { hasPeriod: 'last_cash_out' },
            validate: undefined,
        },
    ],
]);

export const useReportPopup = () => {
    const dispatch = useAppDispatch();
    const { isPopupOpened, accountId, name, reportType } = useAppSelector(reportPopupPropsSelector);
    const formRef = useRef<FormApi<ReportFormValue>>();
    const isCashOutReport = reportType === 'cashout';
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentContext = useMemo(() => {
        if (!reportType) {
            return null;
        }

        return reportContextMapping.get(reportType);
    }, [reportType]);

    const onClosePopupHandler = useCallback(() => {
        dispatch(
            accountingActions.setReportPopupProps({
                isPopupOpened: false,
                name: null,
                accountId: null,
                reportType: null,
            }),
        );
    }, [dispatch]);

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const makeReportHandler = useCallback(
        async (values: ReportFormValue) => {
            if (currentContext && accountId && values) {
                try {
                    setIsLoading(true);
                    const fetchReport = currentContext.fetcher;
                    const { hasPeriod, startDate, endDate } = values;
                    const isCustomPeriod = hasPeriod === 'custom';
                    const reportParams = {
                        accountId,
                        ...(((isCashOutReport && isCustomPeriod) || !isCashOutReport) && { startDate, endDate }),
                    };

                    const fileUrl = await fetchReport(reportParams);

                    if (fileUrl) {
                        const formattedStartDate = startDate ? format(new Date(startDate), 'dd-MM-yy') : null;
                        const formattedEndDate = endDate ? format(new Date(endDate), 'dd-MM-yy') : null;

                        const periodText = formattedStartDate && formattedEndDate ? `${formattedStartDate}_to_${formattedEndDate}` : 'report';
                        const filename = `${toSnakeCase(name ?? 'driver')}_${reportType}_${periodText}.pdf`;

                        downloadFileUsingAnchorElement({ url: fileUrl, filename });
                    }
                    onClosePopupHandler();
                } catch (error) {
                    const err = { data: error };

                    parseAndShowAxiosError(err, t('make-report-error'));
                }
                setIsLoading(false);
            }
        },
        [accountId, name, reportType, currentContext, isCashOutReport, onClosePopupHandler],
    );
    const initialValues = useMemo(() => currentContext?.initialValues, [currentContext]);

    const onChangeHandler = useCallback(() => {
        if (formRef.current) {
            const { batch, change, getState } = formRef.current;
            const { hasPeriod } = getState().values;

            if (hasPeriod === 'last_cash_out') {
                batch(() => {
                    change('startDate', undefined);
                    change('endDate', undefined);
                });
            }
        }
    }, []);

    return {
        onSubmitHandler,
        makeReportHandler,
        onChangeHandler,
        onClosePopupHandler,
        name,
        initialValues,
        isPopupOpened,
        formRef,
        isCashOutReport,
        currentContext,
        isLoading,
    };
};
