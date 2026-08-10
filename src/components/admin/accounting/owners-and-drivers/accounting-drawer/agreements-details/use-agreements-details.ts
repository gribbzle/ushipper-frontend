import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { CompanyType } from '@/enums/company-type';
import { ContractorTypesEnum } from '@/enums/contractor-types-enum';
import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { FeesRule } from '@/enums/fee/fees-rules-enum';
import { FuelCardsRule } from '@/enums/fuel/fuel-cards-rules-enum';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { isNumber } from '@/shared';
import { useDriversActionsPermission } from '@/hooks/accounting/use-drivers-actions-permission';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingDrawerPropsSelector, selectedAccountSelector } from '@store/admin';
import { accountingAccountsApi, AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { useGetAccountConfigQuery } from '@store/api/accounts-api';
import { staffActions } from '@store/common/staff/slice';
import { formatFeeForForm, formatRecurringFeeForForm } from '@utils/format-fee-for-form';
import { translateByNamespace } from '@utils/i18n';

import { AccountingTab } from '../accounting-drawer-tabs';
import { useHandleCloseAccountingDrawer } from '../hooks/use-handle-close-accounting-drawer';

import { AgreementsDetailsFormState, FeeFields } from './agreements-details.types';
import { useHandleAgreementsSubmitTasks } from './use-handle-agreements-submit-tasks';

const t = translateByNamespace('admin:accounting:notifications');

export const useAgreementsDetails = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { accountId, selectedTab } = useAppSelector(accountingDrawerPropsSelector);
    const account = useAppSelector(selectedAccountSelector);

    const formRef = useRef<FormApi<AgreementsDetailsFormState>>();
    const { handleCloseDrawer } = useHandleCloseAccountingDrawer();
    const { handleSubmitTasks } = useHandleAgreementsSubmitTasks(formRef);
    const hasDriversActionsPermission = useDriversActionsPermission();

    const agreementsFormId = 'agreementsFormId';

    const { data: driverAccountConfig, isSuccess } = useGetAccountConfigQuery(accountId ?? '', {
        skip: !accountId || selectedTab !== AccountingTab.AGREEMENTS,
    });

    const onSubmit = useCallback(
        async (values: AgreementsDetailsFormState) => {
            try {
                await handleSubmitTasks(values);

                toast.success<string>(t('update-agreements-success'));
            } catch (error) {
                const response = error as AxiosResponse<AxiosError>;
                const message = response?.data?.message;

                if (message) {
                    toast.error(message);
                } else {
                    toast.error<string>(t('updated-account-status-error'));
                }
            } finally {
                handleCloseDrawer();
                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
            }
        },
        [handleSubmitTasks, dispatch, handleCloseDrawer],
    );

    const { accountFees, hasAccountCustomFees } = useMemo(() => {
        let hasAccountCustomFees = false;

        const delayedFees = account?.fees.filter(fee => fee.termType === FeeCategoryTermType.DELAYED).map(formatFeeForForm) || [];
        const instantFees = account?.fees.filter(fee => fee.termType === FeeCategoryTermType.INSTANT).map(formatFeeForForm) || [];
        const recurringFees =
            account?.fees.filter(fee => !!fee.recurringMonthDay || !!fee.recurringWeekDay || !!fee.intervalType).map(formatRecurringFeeForForm) || [];

        const feesData: FeeFields = { delayedFees, instantFees, recurringFees };

        if (!!delayedFees?.length || !!instantFees?.length) {
            hasAccountCustomFees = true;
        }

        return { accountFees: feesData, hasAccountCustomFees };
    }, [account]);

    const driverSettingsInitialValues = useMemo(() => {
        const { driverMinimalBalance, loadboardSources, loadboardPaymentTerms, ordersShowFullPrice, orderRequestsAllowed } = driverAccountConfig || {};

        return {
            hasDriverLimitBalance: typeof driverMinimalBalance === 'number',
            driverMinimalBalance: driverMinimalBalance ?? null,
            loadboardSources: loadboardSources ?? [OrderSourcesEnum.CENTRAL_DISPATCH_PARSED],
            loadboardPaymentTerms: loadboardPaymentTerms ?? 'instant',
            ordersShowFullPrice: ordersShowFullPrice ?? false,
            orderRequestsAllowed: orderRequestsAllowed === undefined ? true : orderRequestsAllowed,
        };
    }, [driverAccountConfig]);

    const fuelCardsSettingsInitialValues = useMemo(() => {
        const { fuelLimitRateDef, fuelLimitRateNew, fuelLimitRatePickedUp } = driverAccountConfig || {};
        const hasCustomRules = isNumber(fuelLimitRateDef) || isNumber(fuelLimitRateNew) || isNumber(fuelLimitRatePickedUp);

        return {
            fuelLimitRateDef,
            fuelLimitRateNew,
            fuelLimitRatePickedUp,
            fuelCardsRules: hasCustomRules ? FuelCardsRule.CUSTOM_RULES : FuelCardsRule.GLOBAL_RULES,
        };
    }, [driverAccountConfig]);

    const initialValuesRef = useRef<AgreementsDetailsFormState>({
        contractorType: account?.parent ? ContractorTypesEnum.DRIVER : ContractorTypesEnum.DRIVER_OWNER,
        rules: hasAccountCustomFees ? FeesRule.CUSTOM_RULES : FeesRule.COMPANY_RULES,
        parentId: account?.parent ? account.parent.publicId : undefined,
        driverSettings: driverSettingsInitialValues,
        fuelCardsSettings: fuelCardsSettingsInitialValues,
        accountFees,
    } as AgreementsDetailsFormState);

    const [initialValues, setInitialValues] = useState<AgreementsDetailsFormState>(initialValuesRef.current);

    useEffect(() => {
        if (isSuccess && driverAccountConfig) {
            const updatedValues = {
                ...initialValuesRef.current,
                driverSettings: driverSettingsInitialValues,
                fuelCardsSettings: fuelCardsSettingsInitialValues,
            } as AgreementsDetailsFormState;

            initialValuesRef.current = updatedValues;
            setInitialValues(updatedValues);
        }
    }, [driverSettingsInitialValues, fuelCardsSettingsInitialValues, isSuccess, driverAccountConfig]);

    const handleAddNewDriverOwnerClick = useCallback(() => {
        router.push('/admin/users');
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch, router]);

    const partnerUsers = useMemo(() => {
        const users: AccountingAccountUserData[] = account?.users || [];

        return users.filter(user => user.company?.isPartner);
    }, [account]);

    const disabledAddButton = useMemo(
        () => !hasDriversActionsPermission || !account || (account.users && account.users.length === 0),
        [account, hasDriversActionsPermission],
    );

    const filteredUsers = account?.users.filter(user => user.company && user.company.type !== CompanyType.DRIVER);

    return {
        hasDriversActionsPermission,
        account,
        formRef,
        agreementsFormId,
        initialValues,
        partnerUsers,
        disabledAddButton,
        filteredUsers,
        onSubmit,
        handleAddNewDriverOwnerClick,
    };
};
