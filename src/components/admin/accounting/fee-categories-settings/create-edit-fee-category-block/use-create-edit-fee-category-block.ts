import { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { BalanceType, FeeCategoryType, FeeCategoryValueType } from '@/enums';
import { BackError, processError } from '@/utils/process-error';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, createEditFeeCategoryBlockPropsSelector } from '@store/admin';
import { useGetBalancesQuery } from '@store/api/balances-api';
import { useCreateFeeCategoryMutation, usePartiallyUpdateFeeCategoryMutation } from '@store/api/fee-categories-api';
import { translateByNamespace } from '@utils';

import { CreateEditFeeCategoryFormState } from './create-edit-fee-category-block.types';

const t = translateByNamespace('admin:accounting:fee-categories-settings:create-edit-fee-category-block');

const systemWalletTypes = [BalanceType.DISPATCH_WALLET, BalanceType.USHIPPER_WALLET, BalanceType.FACTORING_WALLET];

export const useCreateEditFeeCategoryBlock = () => {
    const dispatch = useAppDispatch();
    const { selectedFeeCategory, isEditMode } = useAppSelector(createEditFeeCategoryBlockPropsSelector);
    const [updateFeeCategory] = usePartiallyUpdateFeeCategoryMutation();
    const [createFeeCategory] = useCreateFeeCategoryMutation();
    const formRef = useRef<FormApi<CreateEditFeeCategoryFormState>>();

    const { data: fetchedData } = useGetBalancesQuery({ types: systemWalletTypes });

    const walletTypeToBalanceIdMap = useMemo(() => {
        const typeMapping: Record<string, FeeCategoryType[]> = {
            [BalanceType.DISPATCH_WALLET]: [FeeCategoryType.DISPATCH],
            [BalanceType.USHIPPER_WALLET]: [FeeCategoryType.USHIPPER, FeeCategoryType.RECURRING, FeeCategoryType.ORDER_INTERVAL_RECURRING],
            [BalanceType.FACTORING_WALLET]: [FeeCategoryType.FACTORING],
        };

        return (
            fetchedData?.data?.reduce<Record<string, string>>((acc, wallet) => {
                const feeCategoryTypes = typeMapping[wallet.type];

                if (feeCategoryTypes) {
                    feeCategoryTypes.forEach(feeCategoryType => {
                        acc[feeCategoryType] = wallet.publicId;
                    });
                }

                return acc;
            }, {}) || {}
        );
    }, [fetchedData]);

    const onSubmit = useCallback(
        async (values: CreateEditFeeCategoryFormState) => {
            try {
                const { type, balanceId, defaultLimit, ...others } = values;
                const isRecurring = [FeeCategoryType.RECURRING, FeeCategoryType.ORDER_INTERVAL_RECURRING].includes(type);

                const preparedValues = {
                    ...others,
                    type,
                    ...(type === FeeCategoryType.TO_WALLET && { balanceId: balanceId }),
                    defaultLimit: isRecurring ? defaultLimit : null,
                };

                if (selectedFeeCategory) {
                    const res = await updateFeeCategory({ feeCategoryId: selectedFeeCategory.id, data: preparedValues }).unwrap();

                    dispatch(accountingActions.setCreateEditFeeCategoryBlockProps({ selectedFeeCategory: { ...selectedFeeCategory, ...res } }));
                    toast.success(t<string>('update-fee-category-success'));
                } else {
                    const res = await createFeeCategory(preparedValues).unwrap();

                    dispatch(accountingActions.setCreateEditFeeCategoryBlockProps({ selectedFeeCategory: res, isEditMode: true }));
                    toast.success(t<string>('create-fee-category-success'));
                }
            } catch (error) {
                processError(error as BackError);
            }
        },
        [selectedFeeCategory, updateFeeCategory, createFeeCategory, dispatch],
    );

    const initialValues = useMemo(() => {
        return selectedFeeCategory
            ? {
                  name: selectedFeeCategory.name,
                  type: selectedFeeCategory.type,
                  defaultValue: selectedFeeCategory.defaultValue,
                  valueType: selectedFeeCategory.valueType,
                  balanceId: selectedFeeCategory.balanceId ?? '',
                  defaultLimit: selectedFeeCategory.defaultLimit,
              }
            : { valueType: FeeCategoryValueType.PERCENT };
    }, [selectedFeeCategory]);

    const onChangeHandler = useCallback(() => {
        if (formRef.current) {
            const { batch, change, getState } = formRef.current;
            const { type, balanceId } = getState().values;

            const isRecurring = [FeeCategoryType.RECURRING, FeeCategoryType.ORDER_INTERVAL_RECURRING].includes(type);

            batch(() => {
                if (isRecurring) {
                    change('valueType', FeeCategoryValueType.FIXED);
                }

                if (type === FeeCategoryType.TO_WALLET) {
                    const previousMappedBalanceId = Object.values(walletTypeToBalanceIdMap).find(id => id === balanceId);

                    if (previousMappedBalanceId) {
                        change('balanceId', '');
                    }

                    return;
                }

                if (walletTypeToBalanceIdMap[type]) {
                    change('balanceId', walletTypeToBalanceIdMap[type]);
                } else {
                    change('balanceId', '');
                }
            });
        }
    }, [walletTypeToBalanceIdMap]);

    return { formRef, initialValues, selectedFeeCategory, isEditMode, onSubmit, onChangeHandler };
};
