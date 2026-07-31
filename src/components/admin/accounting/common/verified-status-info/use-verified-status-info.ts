import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { StatusBlockView } from '@/components/common/status-block/status-block';
import { AccountStatusesEnum } from '@/enums';
import { useDefaultAccountBalance } from '@hooks';
import { useAppDispatch } from '@store';
import { AccountingAccountData, accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { usePartiallyUpdateAccountMutation } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils/i18n';
import { getAccountStatusTranslate } from '@utils/translate/get-account-status-translate';

const statusViewMap: Record<AccountStatusesEnum, StatusBlockView> = {
    [AccountStatusesEnum.ACTIVE]: 'success',
    [AccountStatusesEnum.PENDING]: 'warning',
    [AccountStatusesEnum.ON_HOLD]: 'danger',
    [AccountStatusesEnum.BLOCKED]: 'danger',
};

const t = translateByNamespace('admin:accounting:notifications');

const isUserVerified = (user: AccountingAccountData): boolean => {
    const { users, balances, phoneVerifiedAt, emailVerifiedAt } = user;

    const hasPartnerCompanies = users?.some(user => user.company && user.company.isPartner);
    const hasBalances = balances.length > 0;

    return !!phoneVerifiedAt && !!emailVerifiedAt && hasBalances && hasPartnerCompanies;
};

export const useVerifiedStatusInfo = (info: AccountingAccountData) => {
    const { publicId, users, balances, status } = info;

    const dispatch = useAppDispatch();
    const [updateAccount] = usePartiallyUpdateAccountMutation();

    const isVerified = isUserVerified(info);
    const hasPartnerCompanies = useMemo(() => users?.some(user => user.company && user.company.isPartner), [users]);
    const defaultBalance = useDefaultAccountBalance(balances);

    const handleUpdateAccountStatus = useCallback(
        async (value: AccountStatusesEnum) => {
            try {
                await updateAccount({ accountId: publicId, data: { status: value } }).unwrap();

                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                toast.success<string>(t('updated-account-status-success'));
            } catch {
                toast.error<string>(t('updated-account-status-error'));
            }
        },
        [dispatch, updateAccount, publicId],
    );

    const { isPendingStatus, isBlockedStatus } = useMemo(
        () => ({
            isPendingStatus: status === AccountStatusesEnum.PENDING,
            isBlockedStatus: status === AccountStatusesEnum.BLOCKED,
        }),
        [status],
    );

    const options: DropdownOption[] = useMemo(() => {
        return [
            {
                label: getAccountStatusTranslate(AccountStatusesEnum.ACTIVE),
                onClick: () => handleUpdateAccountStatus(AccountStatusesEnum.ACTIVE),
                show: isVerified && !isPendingStatus && status !== AccountStatusesEnum.ACTIVE,
            },
            {
                label: getAccountStatusTranslate(AccountStatusesEnum.ON_HOLD),
                onClick: () => handleUpdateAccountStatus(AccountStatusesEnum.ON_HOLD),
                show: isVerified && !isPendingStatus && status !== AccountStatusesEnum.ON_HOLD,
            },
            {
                label: getAccountStatusTranslate(AccountStatusesEnum.BLOCKED),
                onClick: () => handleUpdateAccountStatus(AccountStatusesEnum.BLOCKED),
                show: !isBlockedStatus,
            },
            {
                label: getAccountStatusTranslate(AccountStatusesEnum.PENDING),
                onClick: () => handleUpdateAccountStatus(AccountStatusesEnum.PENDING),
                show: isBlockedStatus && !isVerified,
            },
        ];
    }, [isPendingStatus, isBlockedStatus, status, handleUpdateAccountStatus, isVerified]);

    const statusView = useMemo(() => statusViewMap[status], [status]);

    const isCompact = useMemo(() => {
        const visibleOptions = options.filter(option => option.show);

        return visibleOptions.length <= 1;
    }, [options]);

    return { options, statusView, defaultBalance, hasPartnerCompanies, isCompact };
};
