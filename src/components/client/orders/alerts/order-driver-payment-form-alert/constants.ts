import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';

import { OrderDriverPaymentFormAlertViewVariant } from './order-driver-payment-form-alert.types';

export const ORDER_DRIVER_PAYMENT_FORM_ALERT_VIEW = new Map<InstantTermPaymentType | null, OrderDriverPaymentFormAlertViewVariant>([
    [InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED, 'danger'],
    [InstantTermPaymentType.RECIPIENT_COMPANY_PAID, 'success'],
    [InstantTermPaymentType.RECIPIENT_COMPANY, 'default'],
    [InstantTermPaymentType.RECIPIENT_DRIVER, 'default'],
    [null, 'warning'],
]);
