import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { MassPayUserTypesEnum } from '@/enums';
import { AccountPaymentMethod } from '@store/api/accounts-api';

export type InitiateAccountPaymentMethodsFormState = Partial<Record<MassPayUserTypesEnum, string>> & {
    paymentMethodType: AccountPaymentMethod;
};

export type InitiateAccountPaymentMethodsFormProps = {
    formRef: MutableRefObject<FormApi<InitiateAccountPaymentMethodsFormState> | undefined>;
    onAfterSubmit: () => void;
};
