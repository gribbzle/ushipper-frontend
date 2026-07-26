import React from 'react';

import { AccountingInfoRow } from '@/components/admin/accounting';
import { AccountingAccountBalanceData } from '@store/api/accounting-accounts-api';
import { classname, getFullNameOfUser, translateByNamespace } from '@utils';

import { MenuItem } from './menu-item';

import './payment-details-dropdown-menu.scss';

const cn = classname('payment-details-dropdown-menu');
const t = translateByNamespace('admin:accounting:owners-and-drivers:table');
const tBankAccount = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

type PaymentDetailsDropdownMenuProps = {
    balances: AccountingAccountBalanceData[];
};

export const PaymentDetailsDropdownMenu = ({ balances }: PaymentDetailsDropdownMenuProps) => (
    <div className={cn('')}>
        <div className={cn('wrapper')}>
            {balances.map(balance => {
                const { name, accountSubtype, publicId, bankAccount, card } = balance;

                return (
                    <MenuItem
                        key={publicId}
                        isHover={true}
                        subMenu={
                            <>
                                {bankAccount && (
                                    <MenuItem>
                                        <div className={cn('wrapper')}>
                                            {bankAccount.bankName && <AccountingInfoRow title={tBankAccount('bank-name')} value={bankAccount.bankName} />}
                                            {bankAccount.routingNo && (
                                                <AccountingInfoRow title={tBankAccount('routing-number')} value={bankAccount.routingNo} />
                                            )}
                                            {bankAccount.accountNumber && (
                                                <AccountingInfoRow title={tBankAccount('account-number')} value={bankAccount.accountNumber} />
                                            )}
                                            {bankAccount.nameOnAccount && (
                                                <AccountingInfoRow title={tBankAccount('name-on-account')} value={bankAccount.nameOnAccount} />
                                            )}
                                        </div>
                                    </MenuItem>
                                )}
                                {card && (
                                    <MenuItem>
                                        <div className={cn('wrapper')}>
                                            <AccountingInfoRow
                                                title={tBankAccount('user-name-on-card')}
                                                value={getFullNameOfUser(card.firstName, card.lastName)}
                                            />
                                            {card.middleName && <AccountingInfoRow title={tBankAccount('middle-name-on-card')} value={card.middleName} />}
                                            {card.number && <AccountingInfoRow title={tBankAccount('card-number')} value={card.number} />}
                                            {card.expiry && <AccountingInfoRow title={tBankAccount('card-exp-date')} value={card.expiry} />}
                                        </div>
                                    </MenuItem>
                                )}
                                {!(card || bankAccount) && <MenuItem>{t('no-card-bank-account')}</MenuItem>}
                            </>
                        }
                    >
                        <div className={cn('row')}>
                            {name} {!!accountSubtype && <>({accountSubtype})</>}
                        </div>
                    </MenuItem>
                );
            })}
        </div>
    </div>
);
