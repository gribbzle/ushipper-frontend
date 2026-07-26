import fundsTransferCalculatedStatus from './funds-transfer-calculated-status.json';
import instantTermPaymentMethod from './instant-term-payment-type.json';
import orderCopCopOptions from './order-cod-cop-options.json';
import orderSource from './order-source.json';
import orderStatisticsGroup from './order-statistics-group.json';
import orderStatisticsStatuses from './order-statistics-statuses.json';

export const orders = {
    'funds-transfer-calculated-status': fundsTransferCalculatedStatus,
    'instant-term-payment-type': instantTermPaymentMethod,
    'order-cod-cop-options': orderCopCopOptions,
    'order-source': orderSource,
    'order-statistics-group': orderStatisticsGroup,
    'order-statistics-statuses': orderStatisticsStatuses,
};

export default orders;
