import { FieldRenderProps } from 'react-final-form';

import { DelayedPaymentTerm, InstantPaymentTerm, PaymentTerm } from '@/enums';

export type PaymentTermsSelectProps = FieldRenderProps<string> & {
    values: PaymentTerm | InstantPaymentTerm | DelayedPaymentTerm;
    disabledOtherOption?: boolean;
};
