import React from 'react';

import { Button } from '@/components/common/button/button';
import { useDriversActionsPermission } from '@hooks';
import { PencilWithLineIcon, TrashIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountingItem } from '../../common';
import { DeleteFinancialAccountPopup } from '../delete-financial-account-popup';
import { EmptyFinancialAccounts } from '../empty-financial-accounts';

import { FinancialAccountContent } from './financial-account-content';
import { FinancialAccountHeader } from './financial-account-header';
import { FinancialAccountsListProps } from './financial-accounts-list.types';
import { useFinancialAccountsList } from './use-financial-accounts-list';

import './financial-accounts-list.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');
const cn = classname('financial-accounts-list');

export const FinancialAccountsList = ({ balances }: FinancialAccountsListProps) => {
    const { handleFinancialAccountEdit, openConfirmationModal } = useFinancialAccountsList();
    const hasDriversActionsPermission = useDriversActionsPermission();

    return (
        <>
            <div className={cn()}>
                {balances.map(balance => (
                    <AccountingItem
                        header={<FinancialAccountHeader name={balance.name} type={balance.type} />}
                        key={balance.publicId}
                        body={<FinancialAccountContent balance={balance} />}
                        footer={
                            hasDriversActionsPermission && (
                                <div className={cn('actions')}>
                                    <Button onClick={() => handleFinancialAccountEdit(balance.publicId)} view='default' size='mini'>
                                        <PencilWithLineIcon /> {t('edit')}
                                    </Button>
                                    <Button onClick={() => openConfirmationModal(balance)} view='danger' size='mini'>
                                        <TrashIcon /> {t('delete')}
                                    </Button>
                                </div>
                            )
                        }
                    />
                ))}
                {hasDriversActionsPermission && <EmptyFinancialAccounts />}
            </div>
            <DeleteFinancialAccountPopup />
        </>
    );
};
