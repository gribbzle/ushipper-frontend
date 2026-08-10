import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { MassPayUserTypesEnum } from '@/enums/account/masspay-user-types-enum';
import { AccountPaymentMethod } from '@store/api/accounts-api';

export type InitiateAccountPaymentMethodsFormState = Partial<Record<MassPayUserTypesEnum, string>> & {
    paymentMethodType: AccountPaymentMethod;
};

export type InitiateAccountPaymentMethodsFormProps = {
    formRef: MutableRefObject<FormApi<InitiateAccountPaymentMethodsFormState> | undefined>;
    onAfterSubmit: () => void;
};
