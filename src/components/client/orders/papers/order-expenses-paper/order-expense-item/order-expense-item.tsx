import React from 'react';
import { format } from 'date-fns';
import { toKebabCase } from 'js-convert-case';

import { IconButton, OrderTag } from '@components';
import { PencilIcon, TrashIcon } from '@icons';
import { OrderExpense } from '@store/api/order-expenses-api';
import { classname, formatToCurrency, translateByNamespace } from '@utils';

const t = translateByNamespace('common:expense-types');
const cn = classname('expenses-paper');

type OrderExpenseItemProps = {
    expense: OrderExpense;
    disabled?: boolean;
    onDeleteExpense: (expense: OrderExpense) => void;
    onEditExpense: (expense: OrderExpense) => void;
};

export const OrderExpenseItem = ({ expense, disabled = false, onDeleteExpense, onEditExpense }: OrderExpenseItemProps) => {
    const { id, price, type, receiptAt, attachment, showExpenseOnInvoice, deductFromDriverPay } = expense;

    return (
        <div key={id} className={cn('row')}>
            <span className={cn('type')}>{type && t(toKebabCase(type))}</span>
            <span className={cn('price')}>{price && formatToCurrency(price)}</span>
            <span className={cn('date')}>{receiptAt && format(new Date(receiptAt), 'MMM, yy')}</span>
            <div className={cn('file')}>{attachment && <span>{attachment.name}</span>}</div>
            <div>
                <OrderTag view={showExpenseOnInvoice ? 'delivered' : 'on-hold'}>{showExpenseOnInvoice ? 'Yes' : 'No'}</OrderTag>
            </div>
            <div className={cn('deduct-from-driver-pay')}>
                <OrderTag view={deductFromDriverPay ? 'delivered' : 'on-hold'}>{deductFromDriverPay ? 'Yes' : 'No'}</OrderTag>
                {!disabled && (
                    <>
                        <IconButton Icon={PencilIcon} onClick={() => onEditExpense(expense)} />
                        <IconButton Icon={TrashIcon} onClick={() => onDeleteExpense(expense)} />
                    </>
                )}
            </div>
        </div>
    );
};
