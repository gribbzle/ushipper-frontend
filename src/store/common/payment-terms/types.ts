import { PaymentMethod as PaymentMethodEnum, PaymentTerm as PaymentTermEnum } from '@/enums';

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
