import React from 'react';

import { ExpenseTypeEnum } from '@/enums';
import { ExpenseTypesSelect, IconButton } from '@components';
import { CheckboxInput, DatePicker, FieldPrefix, FormControl, PrefixedField, SimpleFileUploader, TextField } from '@fields';
import { TrashIcon } from '@icons';
import { OrderFormState } from '@store/client';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import './expense.scss';

type Props = {
    className: string;
    name: string;
    onDelete: () => void;
    withSpecifyType?: boolean;
    index: number;
};

const cn = classname('expense');
const t = translateByNamespace('client:order:expenses:fields');
const tPlaceholder = translateByNamespace('client:order:fields');

const validateExpense = (index: number, value: any, allValues: OrderFormState) => {
    const currentRow = allValues.expenses ? allValues.expenses[index] : undefined;

    if (currentRow) {
        const filledField = Object.values(currentRow)
            .filter(val => val !== ExpenseTypeEnum.OTHER)
            .find(val => !!val);

        if (filledField) {
            return required(value);
        }
    }

    return undefined;
};

export const Expense = ({ className, name, onDelete, index, withSpecifyType = false }: Props) => {
    return (
        <div className={className}>
            <FieldPrefix prefix={name}>
                <div className={cn('type')}>
                    <FormControl>
                        <PrefixedField name='type' component={ExpenseTypesSelect} displayAllOptions={true} placeholder={tPlaceholder('no-placeholder')} />
                    </FormControl>
                    {withSpecifyType && <PrefixedField name='specifyType' component={TextField} placeholder={t('specify-type-placeholder')} />}
                </div>
                <FormControl>
                    <PrefixedField
                        validate={(value, allValues) => {
                            return validateExpense(index, value, allValues);
                        }}
                        name='price'
                        component={TextField}
                        startAdornment='$'
                        type='number'
                        parse={value => value}
                        placeholder={tPlaceholder('no-placeholder')}
                    />
                </FormControl>
                <FormControl>
                    <PrefixedField
                        validate={(value, allValues) => {
                            return validateExpense(index, value, allValues);
                        }}
                        name='receiptAt'
                        component={DatePicker}
                        parse={value => value}
                        placeholder={tPlaceholder('no-placeholder')}
                    />
                </FormControl>
                <PrefixedField name='attachment' className={cn('receipt-file')} component={SimpleFileUploader} />
                <PrefixedField name='showExpenseOnInvoice' component={CheckboxInput} className={cn('show-on-invoice')} />
                <PrefixedField name='deductFromDriverPay' component={CheckboxInput} className={cn('deduct-from-driver-pay')} />
                <IconButton Icon={TrashIcon} onClick={onDelete} />
            </FieldPrefix>
        </div>
    );
};
