import React, { useCallback, useMemo } from 'react';
import has from 'has-values';
import { useRouter } from 'next/router';

import { OrderExpenseDrawer } from '@/components/client/orders/drawers/order-expense-drawer/order-expense-drawer';
import { DeleteOrderExpensePopup } from '@/components/client/orders/popups/delete-order-expense-popup/delete-order-expense-popup';
import { Button } from '@/components/common/button/button';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useCanManageOrder } from '@/hooks/order';
import { PlusIcon } from '@icons';
import { useAppDispatch } from '@store';
import { OrderExpense, useGetOrderExpensesQuery } from '@store/api/order-expenses-api';
import { ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OrderExpenseItem } from './order-expense-item';

import './order-expenses.scss';

const cn = classname('expenses-paper');
const t = translateByNamespace('client:order:expenses');

type EmptyBlockProps = {
    handleAddExpenseClick: () => void;
};

type FilledBlockProps = EmptyBlockProps & {
    expenses: OrderExpense[] | [];
    counter: number;
};

const EmptyBlock = ({ handleAddExpenseClick }: EmptyBlockProps) => {
    const canPerformActions = useCanManageOrder();

    const title = useMemo((): string => (canPerformActions ? t('empty-label') : t('no-data-label')), [canPerformActions]);

    return <Paper className={cn('', ['no-print'])} body={<ZoneButton label={title} onClick={handleAddExpenseClick} disabled={!canPerformActions} />} />;
};

const FilledBlock = ({ handleAddExpenseClick, expenses, counter }: FilledBlockProps) => {
    const dispatch = useAppDispatch();
    const canPerformActions = useCanManageOrder();

    const handleDeleteClick = useCallback(
        (expense: OrderExpense) => {
            dispatch(
                ordersActions.setDeleteExpensePopupProps({
                    isVisible: true,
                    expenseId: expense.publicId,
                    expenseType: expense.type,
                }),
            );
        },
        [dispatch],
    );

    const handleEditExpenseClick = useCallback(
        ({ publicId }: OrderExpense) => {
            dispatch(ordersActions.setOrderExpenseDrawerProps({ isVisible: true, expenseId: publicId }));
        },
        [dispatch],
    );

    return (
        <>
            <Paper
                className={cn()}
                title={t('header')}
                counter={counter}
                actions={
                    canPerformActions && (
                        <Button size='medium' onClick={handleAddExpenseClick}>
                            <PlusIcon /> {t('add-btn-label')}
                        </Button>
                    )
                }
                body={
                    <>
                        <div className={cn('header')}>
                            <span>{t('fields.type-label')}</span>
                            <span>{t('fields.cost-label')}</span>
                            <span>{t('fields.date-label')}</span>
                            <span>{t('fields.receipt-file-label')}</span>
                            <span>{t('fields.show-on-invoice-label')}</span>
                            <span>{t('fields.deduct-from-driver-pay-label')}</span>
                        </div>
                        {expenses.map(expense => (
                            <OrderExpenseItem
                                key={expense.id}
                                expense={expense}
                                onDeleteExpense={handleDeleteClick}
                                onEditExpense={handleEditExpenseClick}
                                disabled={!canPerformActions}
                            />
                        ))}
                    </>
                }
            />
            {canPerformActions && <DeleteOrderExpensePopup />}
        </>
    );
};

export const OrderExpenses = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const { data: expenses = [] } = useGetOrderExpensesQuery(orderId, { skip: !has(orderId) });

    const handleAddExpenseClick = useCallback(() => {
        dispatch(ordersActions.setOrderExpenseDrawerProps({ isVisible: true, expenseId: null }));
    }, [dispatch]);

    return (
        <>
            {has(expenses) ? (
                <FilledBlock handleAddExpenseClick={handleAddExpenseClick} expenses={expenses} counter={expenses.length} />
            ) : (
                <EmptyBlock handleAddExpenseClick={handleAddExpenseClick} />
            )}
            <OrderExpenseDrawer />
        </>
    );
};
