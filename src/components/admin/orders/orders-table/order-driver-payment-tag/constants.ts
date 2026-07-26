import { InstantTermPaymentType } from '@enums';

export const INSTANT_TERM_PAYMENT_TYPE_TAG_VARIANT: Record<InstantTermPaymentType, 'delivered' | 'source-declined' | 'picked-up'> = {
    [InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED]: 'source-declined',
    [InstantTermPaymentType.RECIPIENT_COMPANY_PAID]: 'delivered',
    [InstantTermPaymentType.RECIPIENT_COMPANY]: 'picked-up',
    [InstantTermPaymentType.RECIPIENT_DRIVER]: 'picked-up',
};
