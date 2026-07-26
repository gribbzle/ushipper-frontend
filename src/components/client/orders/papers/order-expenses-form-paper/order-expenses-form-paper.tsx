import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';

import { ExpenseTypeEnum } from '@/enums';
import { Button, OrderExpensesForm, Paper } from '@components';
import { PlusIcon } from '@icons';
import { OrderFieldsGroup } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:order:expenses');

type Props = React.FormHTMLAttributes<HTMLFormElement | HTMLDivElement> & {
    className: string;
    counterExpenses?: number;
};

export const OrderExpensesFormPaper = ({ className, counterExpenses = 0 }: Props) => {
    const form = useForm();
    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        setCounter(counterExpenses);
    }, [counterExpenses]);

    const handleExpenseAdd = useCallback(() => {
        form.mutators.push(OrderFieldsGroup.EXPENSES, { type: ExpenseTypeEnum.OTHER });
        setCounter(prev => prev + 1);
    }, [form.mutators]);

    const handleExpenseDelete = useCallback(
        (index: number) => {
            const deletedExpenseId = form.getState().values[OrderFieldsGroup.EXPENSES][index]?.publicId;

            form.mutators.remove(OrderFieldsGroup.EXPENSES, index);
            setCounter(prev => prev - 1);

            if (deletedExpenseId) {
                form.batch(() => {
                    form.mutators.push('deletedExpenses', deletedExpenseId);
                });
            }
        },
        [form],
    );

    const addBtn = useMemo(
        () => (
            <Button size='medium' onClick={handleExpenseAdd} type='button'>
                <PlusIcon /> {t('add-btn-label')}
            </Button>
        ),
        [handleExpenseAdd],
    );

    return (
        <Paper
            className={className}
            title={t('header')}
            counter={counter}
            actions={addBtn}
            body={<OrderExpensesForm handleExpenseDelete={handleExpenseDelete} />}
        />
    );
};
