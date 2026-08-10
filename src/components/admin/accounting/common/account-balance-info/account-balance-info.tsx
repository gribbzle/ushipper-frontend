import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { BalanceType } from '@/enums/balance-type';
import { useDefaultAccountBalance, useTransactionActionsPermission } from '@hooks';
import { PlusIcon } from '@icons';
import { BalanceValue } from '@store/admin';
import { AccountingAccountData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { useCreateTransactionPopup } from '../create-transaction-popup';

import './account-balance-info.scss';

type AccountBalanceInfoProps = Pick<AccountingAccountData, 'balances'> & {
    accountPublicId: string;
    pendingBalance: BalanceValue | null;
};

const t = translateByNamespace('admin:accounting:owners-and-drivers:table');
const cn = classname('account-balance-info');

export const AccountBalanceInfo = ({ balances, accountPublicId, pendingBalance }: AccountBalanceInfoProps) => {
    const defaultBalance = useDefaultAccountBalance(balances);
    const { openCreateTransactionPopup } = useCreateTransactionPopup();
    const hasActionsPermission = useTransactionActionsPermission();

    const internalWallet = useMemo(() => balances?.find(balance => balance.type === BalanceType.INTERNAL_USER_WALLET), [balances]);

    const actualBalance = useMemo(() => {
        if (defaultBalance) {
            const balanceAmount = parseInt(defaultBalance.displayedBalance.amount || '0', 10);

            return balanceAmount / 100;
        }

        return 0;
    }, [defaultBalance]);

    const onAddTransactionClickHandler = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            openCreateTransactionPopup({ disabledSourceWallet: true, internalWalletId: internalWallet?.publicId, accountPublicId });
        },
        [openCreateTransactionPopup, accountPublicId, internalWallet?.publicId],
    );

    return defaultBalance ? (
        <div className={cn()}>
            <div className={cn('balance-and-button')}>
                {formatToCurrency(actualBalance)}
                {hasActionsPermission && (
                    <Button view='default' plain={true} size='mini' onClick={onAddTransactionClickHandler}>
                        <PlusIcon />
                    </Button>
                )}
            </div>
            <span className={cn('pending')}>
                {t('pending-label')}: {pendingBalance?.formatted ?? formatToCurrency(0)}
            </span>
        </div>
    ) : (
        <>—</>
    );
};
