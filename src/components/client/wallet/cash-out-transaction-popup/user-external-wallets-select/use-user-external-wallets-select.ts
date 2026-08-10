import { useCallback, useEffect, useMemo, useState } from 'react';

import { BalanceType } from '@/enums/balance-type';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { useAsyncSelect } from '@hooks';
import { FinancialBalanceData } from '@store/admin';
import { useLazyGetBalanceQuery, useLazyGetBalancesQuery } from '@store/api/balances-api';

import { UserExternalWalletsSelectProps } from './user-external-wallets-select.types';

const DEFAULT_PARAMS = {
    orderName: 'created_at',
    orderDirection: OrderSortingDirection.ASC,
};

export const getAccountLabel = (item: FinancialBalanceData): string => {
    const { bankAccount, card } = item;
    const accountNumber = bankAccount?.maskedAccountNumber ?? card?.maskedNumber ?? null;

    return `${item.name}${accountNumber ? ` (${accountNumber})` : ''}`;
};

export const useUserExternalWalletsSelect = ({ input, meta, accountId }: UserExternalWalletsSelectProps) => {
    const [getItems] = useLazyGetBalancesQuery();
    const [getSelectedItem] = useLazyGetBalanceQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input });

    const loadOptions = useCallback(
        async (value: string) => {
            try {
                const params = {
                    ...(value ? { search: value } : { perPage: 10 }),
                    ...DEFAULT_PARAMS,
                    types: [BalanceType.EXTERNAL_BANK_WALLET, BalanceType.EXTERNAL_CARD_WALLET],
                    ...(accountId ? { accountId } : {}),
                };

                const res = await getItems(params).unwrap();

                return res?.data.map(item => ({
                    label: getAccountLabel(item),
                    value: item.publicId,
                }));
            } catch {
                return [];
            }
        },
        [getItems, accountId],
    );

    const [key, setKey] = useState(0);

    useEffect(() => {
        setReady(false);
        setKey(prevKey => prevKey + 1);

        const loadItem = async (balanceId?: string) => {
            try {
                if (balanceId) {
                    const res = await getSelectedItem(balanceId).unwrap();

                    setDefaultSelectedOption({ label: getAccountLabel(res), value: res.publicId });
                }
            } catch {
            } finally {
                setReady(true);
            }
        };

        if (initialValues) {
            if (input.value) {
                loadItem(input.value);
            } else {
                setDefaultSelectedOption(undefined);
                setReady(true);
            }
        }
    }, [setDefaultSelectedOption, setReady, initialValues, getSelectedItem, input.value]);

    const errored = useMemo(() => meta.error && meta.touched, [meta.error, meta.touched]);

    return { selectReady, errored, key, defaultSelectedOption, onChangeHandler, loadOptions };
};
