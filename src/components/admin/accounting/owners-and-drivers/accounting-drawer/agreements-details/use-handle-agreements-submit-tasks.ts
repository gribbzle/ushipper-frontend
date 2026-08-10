import { MutableRefObject, useCallback } from 'react';
import { FormApi } from 'final-form';

import { ContractorTypesEnum } from '@/enums/contractor-types-enum';
import { FeesRule } from '@/enums/fee/fees-rules-enum';
import { FuelCardsRule } from '@/enums/fuel/fuel-cards-rules-enum';
import { useHandleCreateEditAccountFees, useHandleDeleteFees } from '@hooks';
import { useAppSelector } from '@store';
import { selectedAccountSelector } from '@store/admin';
import { usePartiallyUpdateAccountMutation, useUpdateAccountConfigMutation } from '@store/api/accounts-api';

import { AgreementsDetailsFormState } from './agreements-details.types';
import { extractDeletedFeeIds, hasModifiedDriverSettings, hasModifiedFuelCardsSettings } from './utils';
import { transformDeletedCustomFeesValues } from './utils';

export const useHandleAgreementsSubmitTasks = (formRef: MutableRefObject<FormApi<AgreementsDetailsFormState> | undefined>) => {
    const [updateAccount] = usePartiallyUpdateAccountMutation();
    const [updateAccountConfig] = useUpdateAccountConfigMutation();

    const account = useAppSelector(selectedAccountSelector);

    const handleCreateEditAccountFees = useHandleCreateEditAccountFees();
    const handleDeleteAccountFees = useHandleDeleteFees();

    const handleSubmitTasks = useCallback(
        async (values: AgreementsDetailsFormState) => {
            if (!account || !formRef) return;

            const touched = formRef.current?.getState().touched;
            const modified = formRef.current?.getState().modified;
            const updateTasks = [];

            const { contractorType } = values;

            if (contractorType === ContractorTypesEnum.DRIVER_OWNER) {
                updateTasks.push(
                    await updateAccount({
                        accountId: account.publicId,
                        data: { parentId: null },
                    }).unwrap(),
                );
            } else if (touched?.parentId) {
                updateTasks.push(
                    await updateAccount({
                        accountId: account.publicId,
                        data: { parentId: values.parentId ?? null },
                    }).unwrap(),
                );
            }

            if (hasModifiedDriverSettings(modified) || hasModifiedFuelCardsSettings(modified)) {
                const { driverSettings, contractorType, fuelCardsSettings } = values;
                const { hasDriverLimitBalance, ...others } = driverSettings;
                const { fuelCardsRules, ...otherFuelCardsSettings } = fuelCardsSettings;

                const updatedFuelCardsSettings =
                    fuelCardsRules === FuelCardsRule.GLOBAL_RULES
                        ? {
                              ...otherFuelCardsSettings,
                              fuelLimitRateNew: null,
                              fuelLimitRatePickedUp: null,
                              fuelLimitRateDef: null,
                          }
                        : otherFuelCardsSettings;

                updateTasks.push(
                    await updateAccountConfig({
                        accountPublicId: account.publicId,
                        data: {
                            ...others,
                            driverMinimalBalance:
                                contractorType === ContractorTypesEnum.DRIVER_OWNER && hasDriverLimitBalance
                                    ? Number(driverSettings?.driverMinimalBalance)
                                    : null,
                            ...updatedFuelCardsSettings,
                        },
                    }).unwrap(),
                );
            }

            const feeTasks = async () => {
                const { rules, accountFees } = values;
                const { delayedFees, instantFees, recurringFees } = accountFees;

                if (rules === FeesRule.COMPANY_RULES) {
                    const deleteResult = handleDeleteAccountFees({ deletedFees: extractDeletedFeeIds({ delayedFees, instantFees }) });
                    const createEditRecurringFeesResult = handleCreateEditAccountFees({ accountId: account.publicId, fees: { recurringFees } });

                    return [deleteResult, createEditRecurringFeesResult];
                }

                const createEditFeesResult = handleCreateEditAccountFees({ accountId: account.publicId, fees: accountFees });

                return [createEditFeesResult];
            };

            const deleteTasks = transformDeletedCustomFeesValues(values).map(async ({ deletedFees }) => await handleDeleteAccountFees({ deletedFees }));
            const feeTasksResults = await feeTasks();

            updateTasks.push(...deleteTasks, ...feeTasksResults);

            try {
                await Promise.all(updateTasks);
            } catch (error) {
                throw new Error(`Failed: ${error}`);
            }
        },
        [account, formRef, updateAccount, updateAccountConfig, handleCreateEditAccountFees, handleDeleteAccountFees],
    );

    return {
        handleSubmitTasks,
    };
};
