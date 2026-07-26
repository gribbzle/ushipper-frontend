import { Load } from '@store/client';

export type OrderDriverPaymentFormAlertProps = {
    order: Load | null;
    context?: 'admin' | 'driver';
    size?: 'small';
    headerSize?: 'small';
    isFullDetailed?: boolean;
};
export type OrderDriverPaymentFormAlertViewVariant = 'default' | 'success' | 'danger' | 'warning';
