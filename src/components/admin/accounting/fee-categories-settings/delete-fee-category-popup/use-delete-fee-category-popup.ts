import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, deleteFeeCategoryPopupSelector } from '@store/admin';
import { useDeleteFeeCategoryMutation } from '@store/api/fee-categories-api';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { useFeeCategoriesTable } from '../fee-categories-table/use-fee-categories-table';

const t = translateByNamespace('admin:accounting:fee-categories-settings:delete-fee-category-popup');

export const useDeleteFeeCategoryPopup = () => {
    const dispatch = useAppDispatch();
    const { isVisible, feeCategoryId, feeCategoryName } = useAppSelector(deleteFeeCategoryPopupSelector);
    const [deleteFeeCategory] = useDeleteFeeCategoryMutation();
    const { onRowClickHandler, selectedFeeCategory } = useFeeCategoriesTable();

    const onClosePopupHandler = useCallback(
        () => dispatch(accountingActions.setDeleteFeeCategoryPopupProps({ isVisible: false, feeCategoryId: null, feeCategoryName: null })),
        [dispatch],
    );

    const onDeleteClickHandler = useCallback(async () => {
        if (feeCategoryId) {
            try {
                await deleteFeeCategory(feeCategoryId).unwrap();

                onClosePopupHandler();
                if (feeCategoryId === selectedFeeCategory?.id) {
                    onRowClickHandler(null);
                }

                toast.success(t<string>('delete-fee-category-success'));
            } catch (error) {
                handleError(error);
            }
        }
    }, [feeCategoryId, deleteFeeCategory, onClosePopupHandler, selectedFeeCategory?.id, onRowClickHandler]);

    return { onDeleteClickHandler, onClosePopupHandler, feeCategoryName, isVisible };
};
