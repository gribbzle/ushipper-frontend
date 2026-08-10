import { PaymentMethod as PaymentMethodEnum } from '@/enums/payment-method';
import { PaymentTerm as PaymentTermEnum } from '@/enums/payment-term';

export type PaymentMethod = {
    id: PaymentMethodEnum;
};

export type PaymentTerm = {
    id: PaymentTermEnum;
    methods: PaymentMethod[];
};

export type PaymentTermsSliceState = {
    paymentTerms: PaymentTerm[];
};
