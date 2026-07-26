import { useMemo } from 'react';

import { FinancialBalanceData } from '@store/admin';
import { getFullNameOfUser, getObjectWithoutEmptyFields } from '@utils';

import { useGetAccountingProfile } from '../../../hooks';

export const useFinancialAccountContent = (balance: FinancialBalanceData) => {
    const { billingAddress, card, bankAccount } = balance;
    const { accountingProfile, account } = useGetAccountingProfile();

    const userName = useMemo(
        () => getFullNameOfUser(card?.firstName ?? accountingProfile?.firstName, card?.lastName ?? accountingProfile?.lastName, card?.middleName),
        [accountingProfile?.firstName, accountingProfile?.lastName, card?.firstName, card?.lastName, card?.middleName],
    );

    const address = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                streetAddress: billingAddress?.addressLine1,
                city: billingAddress?.city,
                state: billingAddress?.state,
                zip: billingAddress?.zipCode,
            }),
        [billingAddress],
    );

    const contactInfo = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                fullName: userName,
                phone: account?.phone,
                email: account?.email,
            }),
        [account?.email, account?.phone, userName],
    );

    const bankAccountInfo = useMemo(() => getObjectWithoutEmptyFields(bankAccount), [bankAccount]);

    const cardInfo = useMemo(() => getObjectWithoutEmptyFields(card), [card]);

    return { contactInfo, address, bankAccountInfo, cardInfo };
};
