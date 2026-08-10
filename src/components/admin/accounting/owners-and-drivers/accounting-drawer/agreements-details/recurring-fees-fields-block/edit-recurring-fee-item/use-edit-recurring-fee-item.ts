import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'debounce';
import get from 'lodash.get';
import { useForm } from 'react-final-form';

import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { useOpenTransactionsPage } from '@hooks';
import { useAppSelector } from '@store';
import { selectedAccountSelector } from '@store/admin';
import { useGetFeeCategoriesQuery } from '@store/api/fee-categories-api';

import { EditRecurringFeeItemProps } from './edit-recurring-fee-item.types';

export const useEditRecurringFeeItem = ({ prefix }: Pick<EditRecurringFeeItemProps, 'prefix'>) => {
    const account = useAppSelector(selectedAccountSelector);
    const { batch, change, getState } = useForm();
    const { values } = getState();
    const [selectedFeeCategoryId, setSelectedFeeCategory] = useState<number | undefined>();

    const { data: feeCategories = [] } = useGetFeeCategoriesQuery();

    const selectedFeeCategory = useMemo(
        () => feeCategories?.find(feeCategory => feeCategory.id === selectedFeeCategoryId),
        [selectedFeeCategoryId, feeCategories],
    );

    const period = useMemo(() => get(values, `${prefix}.period`), [prefix, values]);
    const intervalType = useMemo(() => get(values, `${prefix}.intervalType`), [prefix, values]);
    const initialFeeCategoryId = useMemo(() => get(values, `${prefix}.feeCategoryId`), [prefix, values]);
    const chargedTotal = useMemo(() => get(values, `${prefix}.chargedTotal`), [prefix, values]);
    const limit = useMemo(() => get(values, `${prefix}.limit`), [prefix, values]);

    useEffect(() => {
        if (intervalType && initialFeeCategoryId && !selectedFeeCategoryId) {
            setSelectedFeeCategory(initialFeeCategoryId);
        }
    }, [intervalType, selectedFeeCategoryId, initialFeeCategoryId]);

    const debouncedHandleRecurringFeePeriodChange = useMemo(
        () =>
            debounce(
                () =>
                    batch(() => {
                        change(`${prefix}.recurringMonthDay`, undefined);
                        change(`${prefix}.recurringWeekDay`, undefined);
                    }),
                200,
            ),
        [prefix, batch, change],
    );

    const debouncedHandlePeriodDelete = useMemo(
        () =>
            debounce(
                () =>
                    batch(() => {
                        change(`${prefix}.period`, undefined);
                    }),
                200,
            ),
        [prefix, batch, change],
    );

    const debouncedHandleIntervalTypeDelete = useMemo(
        () =>
            debounce(
                () =>
                    batch(() => {
                        change(`${prefix}.intervalType`, null);
                        change(`${prefix}.intervalValue`, null);
                    }),
                200,
            ),
        [prefix, batch, change],
    );

    const handleRecurringFeePeriodChange = useCallback(() => debouncedHandleRecurringFeePeriodChange(), [debouncedHandleRecurringFeePeriodChange]);
    const handleRecurringCategoryChange = useCallback(
        (value: number) => {
            setSelectedFeeCategory(value);
            debouncedHandleRecurringFeePeriodChange();
            debouncedHandlePeriodDelete();
            debouncedHandleIntervalTypeDelete();
        },
        [debouncedHandleRecurringFeePeriodChange, debouncedHandlePeriodDelete, debouncedHandleIntervalTypeDelete],
    );

    const openTransactionsPage = useOpenTransactionsPage();

    const handleChangedTotalClick = useCallback(async () => {
        if (account) {
            openTransactionsPage({
                accountId: account.publicId,
                type: PaymentConfirmationType.RECURRING_TRANSACTION,
            });
        }
    }, [account, openTransactionsPage]);

    return {
        handleChangedTotalClick,
        handleRecurringCategoryChange,
        selectedFeeCategory,
        handleRecurringFeePeriodChange,
        selectedFeePeriod: period,
        chargedTotal,
        limit,
    };
};
