import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { BackError, processError } from '@/utils/process-error';
import { useInvalidateSelectedAccountTags } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, selectedAccountSelector } from '@store/admin';
import { accountingAccountsApi, AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { useUpdateUserJSONMutation } from '@store/api/users-api';
import { staffActions } from '@store/common/staff/slice';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:notifications');

export const useAssignedCompaniesBlock = () => {
    const dispatch = useAppDispatch();
    const [updateUser] = useUpdateUserJSONMutation();
    const account = useAppSelector(selectedAccountSelector);
    const invalidateSelectedAccountTags = useInvalidateSelectedAccountTags();

    const onAssignDispatcherClickHandler = useCallback(
        ({ user, reassign = false }: { user: AccountingAccountUserData; reassign?: boolean }) =>
            dispatch(accountingActions.setAssignDispatcherToDriverPopupProps({ isPopupOpened: true, user, reassign })),
        [dispatch],
    );
    const onUnAssignDispatcherClickHandler = useCallback(
        async (user: AccountingAccountUserData) => {
            try {
                await updateUser({ superiorUserPublicId: '', publicId: user.publicId }).unwrap();

                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                invalidateSelectedAccountTags();
                toast.success<string>(t('un-assign-dispatcher-to-driver-success'));
            } catch (error) {
                processError(error as BackError);
            }
        },
        [dispatch, updateUser, invalidateSelectedAccountTags],
    );
    const onDeleteClickHandler = useCallback(
        (user: AccountingAccountUserData) =>
            dispatch(staffActions.setDeleteUserPopupProps({ isVisible: true, userId: user.publicId, userName: user.name ?? '', isAccountContext: true })),
        [dispatch],
    );

    const onOpenAddDriverToCompanyPopupClickHandler = useCallback(
        () =>
            dispatch(
                accountingActions.setAddDriverToCompanyPopupProps({
                    isPopupOpened: true,
                    name: account?.name ?? null,
                    email: account?.email ?? null,
                }),
            ),
        [dispatch, account],
    );

    return { onAssignDispatcherClickHandler, onUnAssignDispatcherClickHandler, onDeleteClickHandler, onOpenAddDriverToCompanyPopupClickHandler };
};
