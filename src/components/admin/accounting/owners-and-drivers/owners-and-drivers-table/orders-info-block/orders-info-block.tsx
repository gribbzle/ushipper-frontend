import React, { useCallback, useMemo } from 'react';

import { RowItem } from '@/components/common/table/common/row-item/row-item';
import { FundsTransferCalculatedStatus, OrderStatisticsStatus } from '@enums';

type OrdersInfoBlockProps = {
    type: string;
    value: number;
    accountId: string;
};

const parameterMap: Record<string, string> = {
    documentsRequested: `fundsTransferCalculatedStatus=${FundsTransferCalculatedStatus.PENDING_DOCUMENTS}`,
    pending: `fundsTransferCalculatedStatus=${FundsTransferCalculatedStatus.PENDING}`,
    damageClaimed: `fundsTransferCalculatedStatus=${FundsTransferCalculatedStatus.DAMAGE_CLAIM}`,
};

export const OrdersInfoBlock = ({ type, value, accountId }: OrdersInfoBlockProps) => {
    const baseUrl = useMemo(
        () => `/admin/orders/carrier?page=1&searchSubject=order_id&orderName=creation_date&orderDirection=desc&driverAccountId=${accountId}`,
        [accountId],
    );

    const handleOrdersClick = useCallback(
        (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
            e.stopPropagation();

            let url = baseUrl;

            const extraParams = parameterMap[type];

            if (extraParams) {
                url += `&${extraParams}`;
            }

            if (type !== 'total') {
                url += `&statisticsStatus=${OrderStatisticsStatus.DELIVERED}`;
            }

            window.open(url, '_blank');
        },
        [type, baseUrl],
    );

    return <RowItem value={value} isHover={value > 0} onClick={value > 0 ? e => handleOrdersClick(e) : undefined} />;
};
