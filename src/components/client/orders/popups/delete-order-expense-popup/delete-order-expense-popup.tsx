import React, { useCallback } from 'react';
import { toKebabCase } from 'js-convert-case';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { useDeleteOrderExpenseMutation } from '@store/api/order-expenses-api';
import { deleteOrderExpensePopupSelector, orderPublicIdSelector, ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './delete-order-expense-popup.scss';

const cn = classname('delete-order-expense-popup');
const translatePopup = translateByNamespace('client:order:delete-expense-popup');
const translateExpenseType = translateByNamespace('common:expense-types');

export const DeleteOrderExpensePopup = () => {
    const dispatch = useAppDispatch();
    const { isVisible, expenseId, expenseType } = useAppSelector(deleteOrderExpensePopupSelector);
    const orderId = useAppSelector(orderPublicIdSelector);

    const [deleteOrderExpense] = useDeleteOrderExpenseMutation();

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteExpensePopupProps({ isVisible: false, expenseId: null, expenseType: null }));
    }, [dispatch]);

    const handleDeleteOrderExpenseClick = useCallback(async () => {
        if (orderId && expenseId) {
            deleteOrderExpense({ orderId, expenseId })
                .unwrap()
                .then(() => {
                    handleClose();
                    toast.success(translatePopup<string>('success-message-text'));
                })
                .catch(() => {
                    toast.error(translatePopup<string>('error-message-text'));
                });
        }
    }, [expenseId, orderId, handleClose, deleteOrderExpense]);

    return (
        <Popup
            isOpen={isVisible}
            onClose={handleClose}
            title={translatePopup('title', { expenseType: expenseType ? translateExpenseType(toKebabCase(expenseType)) : translateExpenseType('unknown') })}
            className={cn()}
            actions={
                <>
                    <Button size='small' view='danger' onClick={handleDeleteOrderExpenseClick}>
                        {translatePopup('confirm-button-title')}
                    </Button>
                    <Button size='small' onClick={handleClose}>
                        {translatePopup('cancel-button-title')}
                    </Button>
                </>
            }
        />
    );
};
