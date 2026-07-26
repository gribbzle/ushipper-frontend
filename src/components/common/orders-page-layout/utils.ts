import { FundsTransferCalculatedStatus, OrderStatisticsStatus } from '@enums';
import { GetOrdersData } from '@store/api/orders-api';

export const getPartnerStatisticStatus = (statisticsStatus: OrderStatisticsStatus | undefined): Partial<GetOrdersData> => {
    const statusMap: { [key: string]: Partial<GetOrdersData> } = {
        delivered: { fundsTransferCalculatedStatus: FundsTransferCalculatedStatus.NOT_PAID },
        funds_pending: {
            statisticsStatus: OrderStatisticsStatus.DELIVERED,
            fundsTransferCalculatedStatus: FundsTransferCalculatedStatus.PENDING,
        },
        funds_transferred: { statisticsStatus: OrderStatisticsStatus.DELIVERED, fundsTransferCalculatedStatus: FundsTransferCalculatedStatus.PAID },
        funds_claimed: { statisticsStatus: OrderStatisticsStatus.DELIVERED, fundsTransferCalculatedStatus: FundsTransferCalculatedStatus.DAMAGE_CLAIM },
    };

    return statusMap[statisticsStatus || ''] || {};
};
