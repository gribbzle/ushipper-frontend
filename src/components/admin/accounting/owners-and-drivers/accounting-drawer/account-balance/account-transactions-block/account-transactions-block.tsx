import React, { useCallback } from 'react';

import { useCreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/use-create-transaction-popup';
import { Button } from '@/components/common/button/button';
import { useOpenTransactionsPage } from '@/hooks/navigation/useOpenTransactionsPage';
import { useTransactionActionsPermission } from '@/hooks/accounting/use-transaction-actions-permission';
import { CreditCardIcon } from '@icons';
import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector, internalUserWalletFromSelectedAccountSelector } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountTransactionsBlockProps } from './account-transactions-block.types';

import './account-transactions-block.scss';

const cn = classname('account-transactions-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');
const tAddTransaction = translateByNamespace('admin:accounting');

export const AccountTransactionsBlock = ({ subTitle, title, children, showViewAllButton, displayAddTransaction = false }: AccountTransactionsBlockProps) => {
    const { accountId } = useAppSelector(accountingDrawerPropsSelector);
    const internalWallet = useAppSelector(internalUserWalletFromSelectedAccountSelector);
    const { openCreateTransactionPopup } = useCreateTransactionPopup();
    const hasActionsPermission = useTransactionActionsPermission();
    const openTransactionsPage = useOpenTransactionsPage();

    const onViewMoreClick = useCallback(async () => {
        if (accountId) {
            openTransactionsPage({ accountId });
        }
    }, [accountId, openTransactionsPage]);

    return (
        <div className={cn()}>
            <div className={cn('head')}>
                <div className={cn('title')}>
                    {title}
                    {subTitle && <span className={cn('sub-text')}>{subTitle}</span>}
                </div>
                {hasActionsPermission && displayAddTransaction && (
                    <Button
                        view='primary'
                        onClick={() => {
                            if (accountId) {
                                openCreateTransactionPopup({
                                    disabledSourceWallet: true,
                                    internalWalletId: internalWallet?.publicId,
                                    accountPublicId: accountId,
                                });
                            }
                        }}
                    >
                        <CreditCardIcon /> {tAddTransaction('add-transaction-button')}
                    </Button>
                )}
            </div>

            {children}
            {showViewAllButton && (
                <Button view='link' active={true} size='mini' onClick={onViewMoreClick}>
                    {t('view-all-transactions-btn-label')}
                </Button>
            )}
        </div>
    );
};
