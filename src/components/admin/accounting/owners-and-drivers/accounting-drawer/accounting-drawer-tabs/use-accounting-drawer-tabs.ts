import { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { TabItemBase } from '@/components/common';
import { BalanceType } from '@/enums';
import { useDefaultAccountBalance } from '@hooks';
import { useAppSelector } from '@store';
import { balancesFromSelectedAccountSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { AccountingTab } from './accounting-tab-enum';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:tabs');

export const useAccountingDrawerTabs = () => {
    const balances = useAppSelector(balancesFromSelectedAccountSelector);
    const defaultBalance = useDefaultAccountBalance(balances);

    const financialBalances = useMemo(() => balances.filter(item => item.type !== BalanceType.INTERNAL_USER_WALLET), [balances]);
    const accountBalanceCounter = useMemo(() => defaultBalance?.displayedBalance.formatted ?? t('no-account-balance'), [defaultBalance]);
    const financialBalanceCounter = useMemo(() => (financialBalances.length > 0 ? financialBalances.length : undefined), [financialBalances]);

    const tabs = useMemo<TabItemBase[]>(
        () =>
            Object.values(AccountingTab).map(tab => ({
                label: t(toKebabCase(tab)),
                value: tab,
                supText: tab === AccountingTab.ACCOUNT_BALANCE ? accountBalanceCounter : undefined,
                counter: tab === AccountingTab.FINANCIAL_ACCOUNTS ? financialBalanceCounter : undefined,
            })),
        [accountBalanceCounter, financialBalanceCounter],
    );

    return { tabs };
};
