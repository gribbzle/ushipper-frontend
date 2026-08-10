import React from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { ExpenseTypeEnum } from '@/enums';
import {InputLabel} from '@/fields/input-label';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Expense } from './expense';

import './order-expenses-form.scss';

type Props = {
    handleExpenseDelete: (index: number) => void;
};

const t = translateByNamespace('client:order:expenses:fields');
const cn = classname('order-expenses-form');

export const OrderExpensesForm = ({ handleExpenseDelete }: Props) => (
    <div className={cn()}>
        <div className={cn('header')}>
            <InputLabel>{t('type-label')}</InputLabel>
            <InputLabel required={true}>{t('cost-label')}</InputLabel>
            <InputLabel required={true}>{t('date-label')}</InputLabel>
            <InputLabel>{t('receipt-file-label')}</InputLabel>
            <InputLabel className={cn('text-center')}>{t('show-on-invoice-label')}</InputLabel>
            <InputLabel className={cn('text-center')}>{t('deduct-from-driver-pay-label')}</InputLabel>
        </div>
        <FieldArray name={OrderFieldsGroup.EXPENSES}>
            {({ fields }) =>
                fields.map((name, index) => (
                    <Expense
                        className={cn('row')}
                        index={index}
                        key={index}
                        withSpecifyType={fields.value[index]?.type === ExpenseTypeEnum.OTHER}
                        name={name}
                        onDelete={() => handleExpenseDelete(index)}
                    />
                ))
            }
        </FieldArray>
    </div>
);
