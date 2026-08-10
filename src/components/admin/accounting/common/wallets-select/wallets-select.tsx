import React, { useMemo } from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { BalanceType } from '@/enums/balance-type';
import {AsyncSelectField, SelectField} from '@/fields/select-field';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useWalletsSelect } from './use-wallets-select';
import { WalletsSelectProps } from './wallets-select-types';

import './wallets-select.scss';

const cn = classname('wallets-select');
const t = translateByNamespace('admin:accounting:factoring-balance:create-transaction-popup:form');
const tPendingBalance = translateByNamespace('admin:accounting');

export const WalletsSelect = ({
    input,
    meta,
    hasExternalCardWallets,
    onlyCustomInternalWallets,
    showSelectedWalletDetails = true,
    isClearable = true,
    ...rest
}: WalletsSelectProps) => {
    const { selectedWallet, selectReady, errored, key, onChangeHandler, defaultSelectedOption, loadOptions } = useWalletsSelect({
        input,
        meta,
        hasExternalCardWallets,
        onlyCustomInternalWallets,
    });

    const isSystemWallets = useMemo(
        () =>
            selectedWallet &&
            [
                BalanceType.DISPATCH_WALLET,
                BalanceType.USHIPPER_WALLET,
                BalanceType.FACTORING_WALLET,
                BalanceType.COD_WALLET,
                BalanceType.BROKER_WALLET,
                BalanceType.CUSTOM_INTERNAL_WALLET,
            ].includes(selectedWallet.type),
        [selectedWallet],
    );

    const details = useMemo(() => {
        if (!selectedWallet || (selectedWallet.type !== BalanceType.INTERNAL_USER_WALLET && !isSystemWallets)) {
            return null;
        }

        const { accountName, availableBalance, pendingWithdrawal, pendingDeposit, name } = selectedWallet;

        return (
            <AlertBlock>
                <div className={cn('details')}>
                    <span>
                        {isSystemWallets ? t('system-wallet-details', { name }) : t('wallet-details', { userName: accountName })}:{' '}
                        <strong className={cn('strong')}>{availableBalance.formatted}</strong>.
                    </span>
                    <span>
                        {tPendingBalance('pending-withdrawal')}: <strong className={cn('strong')}>{pendingWithdrawal.formatted}</strong>.
                    </span>
                    <span>
                        {tPendingBalance('pending-deposit')}: <strong className={cn('strong')}>{pendingDeposit.formatted}</strong>.
                    </span>
                </div>
            </AlertBlock>
        );
    }, [isSystemWallets, selectedWallet]);

    // TODO crutch to remove blinking until the value for AsyncSelectField is loaded
    if (!selectReady) {
        return <SelectField meta={meta} input={input} placeholder='' {...rest} />;
    }

    return (
        <>
            {selectReady && (
                <div className={cn()}>
                    <AsyncSelectField
                        {...rest}
                        key={key}
                        onChange={onChangeHandler}
                        defaultOptions={true}
                        defaultValue={defaultSelectedOption}
                        loadOptions={loadOptions}
                        isSearchable={true}
                        isMulti={false}
                        isClearable={isClearable}
                        cacheOptions={true}
                        closeMenuOnSelect={true}
                        onBlur={event => input.onBlur(event)}
                        errored={errored}
                        errorText={meta.error || meta.submitError}
                    />
                    {showSelectedWalletDetails && details}
                </div>
            )}
        </>
    );
};
