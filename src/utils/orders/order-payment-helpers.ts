import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { Fee } from '@/types/fee';

import { isFeeValueTypePercent } from '../fees';

export const isReceiptlessOrder = (instantTermPaymentType?: InstantTermPaymentType | null): boolean =>
    !instantTermPaymentType || instantTermPaymentType === InstantTermPaymentType.RECIPIENT_DRIVER;

export const isOrderCheckApproval = (instantTermPaymentType?: InstantTermPaymentType | null): boolean =>
    instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY;

export const isOrderCheckDeclined = (instantTermPaymentType?: InstantTermPaymentType | null): boolean =>
    instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED;

export const isOrderCheckCompanyPaid = (instantTermPaymentType?: InstantTermPaymentType | null): boolean =>
    instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY_PAID;

export const isOrderCheckDriver = (instantTermPaymentType?: InstantTermPaymentType | null): boolean =>
    instantTermPaymentType === InstantTermPaymentType.RECIPIENT_DRIVER;

export const getOrderCheckStatuses = (instantTermPaymentType?: InstantTermPaymentType | null) => ({
    isCheckApproval: isOrderCheckApproval(instantTermPaymentType),
    isCheckDeclined: isOrderCheckDeclined(instantTermPaymentType),
    isOrderCheckCompanyPaid: isOrderCheckCompanyPaid(instantTermPaymentType),
    isOrderCheckDriver: isOrderCheckDriver(instantTermPaymentType),
});

export const calculateTotalFees = (fees: Fee[], totalAmount: number): number => {
    return fees.reduce((total, fee) => {
        const feeValue = isFeeValueTypePercent(fee.valueType) ? (totalAmount * fee.value) / 100 : fee.value;

        return total + feeValue;
    }, 0);
};
