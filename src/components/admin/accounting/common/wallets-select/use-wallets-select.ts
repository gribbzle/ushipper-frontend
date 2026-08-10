import { useCallback, useEffect, useMemo, useState } from 'react';

import { BalanceType } from '@/enums/balance-type';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { useAsyncSelect } from '@/hooks/selects/use-async-select';
import { FinancialBalanceData } from '@store/admin';
import { useLazyGetBalanceQuery, useLazyGetBalancesQuery } from '@store/api/balances-api';

import { WalletsSelectProps } from './wallets-select-types';

const DEFAULT_PARAMS = {
    orderName: 'created_at',
    orderDirection: OrderSortingDirection.ASC,
};

const SYSTEM_WALLETS = [
    BalanceType.FACTORING_WALLET,
    BalanceType.USHIPPER_WALLET,
    BalanceType.DISPATCH_WALLET,
    BalanceType.COD_WALLET,
    BalanceType.CUSTOM_INTERNAL_WALLET,
];

export const useWalletsSelect = ({ input, meta, hasExternalCardWallets, onlyCustomInternalWallets }: WalletsSelectProps) => {
    const [getItems] = useLazyGetBalancesQuery();
    const [getSelectedItem] = useLazyGetBalanceQuery();
    const { onChangeHandler, defaultSelectedOption, setDefaultSelectedOption, selectReady, setReady, initialValues } = useAsyncSelect({ input });
    const [selectedWallet, setSelectedWallet] = useState<FinancialBalanceData | undefined>();

    const types = useMemo(() => {
        if (onlyCustomInternalWallets) {
            return [BalanceType.CUSTOM_INTERNAL_WALLET];
        }

        return [
            BalanceType.EXTERNAL_BANK_WALLET,
            BalanceType.INTERNAL_USER_WALLET,
            ...SYSTEM_WALLETS,
            ...(hasExternalCardWallets ? [BalanceType.EXTERNAL_CARD_WALLET] : []),
        ];
    }, [hasExternalCardWallets, onlyCustomInternalWallets]);

    const loadOptions = useCallback(
        async (value: string) => {
            try {
                const params = value ? { search: value, ...DEFAULT_PARAMS } : { perPage: 10, ...DEFAULT_PARAMS };

                const res = await getItems({ ...params, types }).unwrap();

                const initialBalanceId = input.name === 'sourceBalanceId' ? initialValues?.destinationBalanceId : initialValues?.sourceBalanceId;

                return res?.data.filter(item => item.publicId !== initialBalanceId).map(item => ({ label: item.name, value: item.publicId }));
            } catch {
                return [];
            }
        },
        [getItems, types, input.name, initialValues],
    );

    const [key, setKey] = useState(0);

    useEffect(() => {
        setReady(false);
        setKey(prevKey => prevKey + 1);

        const loadItem = async (balanceId?: string) => {
            try {
                if (balanceId) {
                    const res = await getSelectedItem(balanceId).unwrap();

                    setDefaultSelectedOption({ label: res.name, value: res.publicId });
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

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await getSelectedItem(input.value).unwrap();

                setSelectedWallet(res);
            } catch {
                setSelectedWallet(undefined);
            }
        };

        if (input.value) {
            fetchDetails();
        } else {
            setSelectedWallet(undefined);
        }
    }, [input.value, getSelectedItem]);

    return { selectedWallet, selectReady, errored, key, defaultSelectedOption, onChangeHandler, loadOptions };
};
