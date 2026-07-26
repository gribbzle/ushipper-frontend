import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

export type CashOutTransactionFormState = {
    amount?: number | null;
    destinationBalanceId?: string;
};

export type CashOutTransactionFormProps = {
    formRef: MutableRefObject<FormApi<CashOutTransactionFormState> | undefined>;
    onAfterSubmit: () => void;
};
