import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { fetchOrder } from '@api';
import { IssueReasonTypesEnum, OrderSortingDirection } from '@enums';
import { useQueryFilters, useTable } from '@hooks';
import { GetIssuesParams, IssueData, useGetIssuesQuery } from '@store/api/issues-api';
import { Load } from '@store/client';
import { convertToStringArray } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

export type IssueDataWithOrder = IssueData & {
    order?: Load;
};

const ALERTS_PARAMS: GetIssuesParams = {
    orderDirection: OrderSortingDirection.DESC,
    orderName: 'created_at',
};

const t = translateByNamespace('admin:accounting:notifications');

export const useAlertsTable = () => {
    const { onPageChangeHandler, onOrderChangeHandler, onPerPageChangeHandler } = useTable();
    const [alertsWithOrders, setAlertsWithOrders] = useState<IssueDataWithOrder[]>([]);
    const [isOrdersSuccess, setIsOrdersSuccess] = useState<boolean>(false);

    const { filters } = useQueryFilters<GetIssuesParams>(ALERTS_PARAMS);
    const { statuses, types, ...otherFilters } = filters;

    const params = {
        ...ALERTS_PARAMS,
        ...otherFilters,
        statuses: convertToStringArray(statuses),
        types: convertToStringArray(types),
    };

    const { data: alertsData, isSuccess: isIssuesSuccess, isLoading: isLoadingAlerts, isError } = useGetIssuesQuery(params);

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('upload-alerts-error'));
        }
    }, [isError]);

    const fetchOrdersForAlerts = useCallback(async () => {
        if (!alertsData?.data) {
            return [];
        }

        try {
            const orderPromises = alertsData.data.map(async (alert: IssueData) => {
                if (alert.reasonEntity?.type === IssueReasonTypesEnum.ORDER && alert.reasonEntity?.id) {
                    try {
                        const order = await fetchOrder(alert.reasonEntity.id);

                        return { ...alert, order };
                    } catch {
                        return alert;
                    }
                }

                return alert;
            });

            const updatedAlerts = await Promise.all(orderPromises);

            setAlertsWithOrders(updatedAlerts);
            setIsOrdersSuccess(true);
        } catch {
            toast.error(t<string>('fetch-orders-for-alerts-error'));
            setAlertsWithOrders(alertsData.data);
        } finally {
            setIsOrdersSuccess(true);
        }
    }, [alertsData]);

    useEffect(() => {
        fetchOrdersForAlerts();
    }, [fetchOrdersForAlerts]);

    const isSuccess = useMemo(() => isIssuesSuccess && isOrdersSuccess, [isIssuesSuccess, isOrdersSuccess]);
    const isLoading = useMemo(() => isLoadingAlerts || !isOrdersSuccess, [isLoadingAlerts, isOrdersSuccess]);

    return {
        isLoading,
        isSuccess,
        alerts: alertsWithOrders,
        filters: { ...ALERTS_PARAMS, ...filters },
        metaData: alertsData?.meta,
        onPerPageChangeHandler,
        onPageChangeHandler,
        onOrderChangeHandler,
    };
};
