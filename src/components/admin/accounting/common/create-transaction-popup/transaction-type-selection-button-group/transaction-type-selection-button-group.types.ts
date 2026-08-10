import { FieldValidator } from 'final-form';

import { TransactionTypesEnum } from '@/enums/transactions/transaction-types-enum';

import { LimitedBalanceTypesEnum } from '../create-transaction-form/create-transaction-form.types';

export type TransactionTypeSelectionButtonGroupProps = {
    name: string;
    context: LimitedBalanceTypesEnum;
    validate?: FieldValidator<string>;
    callback: (type: TransactionTypesEnum) => void;
};
