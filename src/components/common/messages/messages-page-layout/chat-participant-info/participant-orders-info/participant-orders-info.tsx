import React, { useCallback, useMemo } from 'react';

import { Loader } from '@/components/common/loader';
import { useGetOrdersStatisticsCountersQuery } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './participant-orders-info.scss';

const cn = classname('participant-orders-info');
const t = translateByNamespace('common:messages-page:chat-participant-info');

export const ParticipantOrdersInfo = ({ accountId }: { accountId: string }) => {
    const { data: statisticsCounters, isLoading, isSuccess } = useGetOrdersStatisticsCountersQuery({ ownerAccountId: accountId });
    const { statusCounters } = statisticsCounters || {};
    const count = useMemo(() => (statusCounters?.assigned ?? 0) + (statusCounters?.pickedUp ?? 0), [statusCounters]);

    const handleOrdersClick = useCallback(
        (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation();
            const url = `/admin/orders/carrier?page=1&searchSubject=order_id&orderName=creation_date&orderDirection=desc&driverAccountId=${accountId}`;

            window.open(url, '_blank');
        },
        [accountId],
    );

    return (
        <div className={cn('')}>
            <h4 className={cn('title')}>{t('active-orders-title')}</h4>
            {isLoading && <Loader />}
            {isSuccess && (
                <>
                    {count > 0 ? (
                        <span className={cn('count')} onClick={count > 0 ? e => handleOrdersClick(e) : undefined}>
                            {count}
                        </span>
                    ) : (
                        <span className={cn('no-orders')}>{t('no-orders-label')}</span>
                    )}
                </>
            )}
        </div>
    );
};
