import { InstantTermPaymentType } from '@/enums';
import { User } from '@store/client';

export type CodCopOrdersActionTagProps = {
    publicId: string;
    driver: User | null;
    driverPay?: number | null;
    instantTermPaymentType: InstantTermPaymentType;
    declinedAt?: string | null;
    paidAt?: string | null;
    instantTermPaymentDeclineReason?: string | null;
    className?: string;
    inline?: boolean;
};
