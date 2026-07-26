import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';

import { BalanceType, TransactionTypesEnum } from '@/enums';

export type CreateTransactionFormState = {
    type: TransactionTypesEnum;
    amount?: number | null;
    notes?: string;
    sourceBalanceId?: string;
    destinationBalanceId?: string;
};

export type LimitedBalanceTypesEnum =
    | BalanceType.FACTORING_WALLET
    | BalanceType.USHIPPER_WALLET
    | BalanceType.DISPATCH_WALLET
    | BalanceType.COD_WALLET
    | BalanceType.INTERNAL_USER_WALLET
    | BalanceType.BROKER_WALLET
    | BalanceType.CUSTOM_INTERNAL_WALLET;

export type CreateTransactionFormProps = {
    context: LimitedBalanceTypesEnum;
    formRef: MutableRefObject<FormApi<CreateTransactionFormState> | undefined>;
    disabledSourceWallet?: boolean;
    onAfterSubmit: () => void;
};
