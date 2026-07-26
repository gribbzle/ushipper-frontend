import has from 'has-values';

import { AccountSubTypesEnum, BalanceType } from '@/enums';
import { BillingAddress, CreateFinancialAccountValues, FinancialBalanceData, UpdateFinancialBalanceValues } from '@store/admin';
import { getObjectWithoutEmptyFields } from '@utils';
import { translateByNamespace } from '@utils';

import { FinancialAccountFormValue } from './financial-account-form.types';

const t = translateByNamespace('common:validators');

/**
 * Converts a date string from "MM/YYYY" format to "YYYY-MM" format.
 * @param {string} dateString - The date string in "MM/YYYY" format.
 * @returns {string} - The date string in "YYYY-MM" format.
 */
const convertDateToISOFormat = (dateString: string): string => {
    const parts = dateString.split('/');

    return `${parts[1]}-${parts[0]}`;
};

const convertISOFormatToDate = (isoString: string): string => {
    const parts = isoString.split('-');

    return `${parts[1]}/${parts[0]}`;
};

export const prepareCreateFinancialAccountData = (values: FinancialAccountFormValue, accountingProfileId: string): CreateFinancialAccountValues => {
    const { accountCategory, type, bankAccountType, cardAccountType, card, bankAccount, ...others } = values;
    const isBankAccountSubtype = type === BalanceType.EXTERNAL_BANK_WALLET;
    const { confirmAccountNumber, ...restOfBankAccount } = bankAccount ?? {};
    const { expiry, number, ...restOfCard } = card ?? {};

    return {
        ...others,
        type,
        accountingProfileId,
        accountSubtype: isBankAccountSubtype ? bankAccountType : cardAccountType,
        ...(isBankAccountSubtype
            ? { bankAccount: restOfBankAccount }
            : { card: { expiry: convertDateToISOFormat(expiry), number: number.replace(/\s+/g, ''), ...restOfCard } }),
    };
};

export const prepareEditFinancialAccountData = (values: FinancialAccountFormValue): UpdateFinancialBalanceValues => {
    const { name, type, card, bankAccount, billingAddress } = values;
    const isBankAccountSubtype = type === BalanceType.EXTERNAL_BANK_WALLET;
    const { nameOnAccount, bankName, routingNo, accountNumber } = bankAccount ?? {};
    const { firstName, lastName, middleName, number, expiry } = card ?? {};

    return {
        name,
        ...(has(getObjectWithoutEmptyFields(billingAddress)) ? { billingAddress } : undefined),
        ...(isBankAccountSubtype
            ? { bankAccount: { nameOnAccount, bankName, routingNo, accountNumber } }
            : { card: { firstName, lastName, middleName, expiry: convertDateToISOFormat(expiry), number: number.replace(/\s+/g, '') } }),
    };
};

const DEFAULT_ACCOUNT_CATEGORY = 'external';

export const getFinancialAccountInitialValues = (balance?: FinancialBalanceData): Partial<FinancialAccountFormValue> => {
    if (balance) {
        const { type, bankAccount, card, accountSubtype, name, billingAddress } = balance;
        const isBankAccountSubtype = type === BalanceType.EXTERNAL_BANK_WALLET;

        const { maskedAccountNumber, accountNumber, ...restOfBankAccount } = bankAccount ?? {};
        const { maskedNumber, number, expiry, ...restOfCard } = card ?? {};

        return {
            accountCategory: DEFAULT_ACCOUNT_CATEGORY,
            type,
            name,
            ...(isBankAccountSubtype ? { bankAccountType: accountSubtype } : { cardAccountType: accountSubtype }),
            ...(isBankAccountSubtype
                ? { bankAccount: { accountNumber: accountNumber, confirmAccountNumber: maskedAccountNumber, ...restOfBankAccount } }
                : { card: { number: number, expiry: convertISOFormatToDate(expiry), ...restOfCard } }),
            ...(has(getObjectWithoutEmptyFields(billingAddress)) ? { billingAddress } : undefined),
        };
    }

    return {
        accountCategory: DEFAULT_ACCOUNT_CATEGORY,
        type: BalanceType.EXTERNAL_BANK_WALLET,
        bankAccountType: AccountSubTypesEnum.CHECKING,
        cardAccountType: AccountSubTypesEnum.DEBIT,
    };
};

export const requiredIfAnyAddressFieldFilled = ({ billingAddress }: FinancialAccountFormValue) => {
    if (billingAddress) {
        const addressKeys: Array<keyof BillingAddress> = ['addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country'];

        const atLeastOneFieldFilled = addressKeys.some(key => !!billingAddress[key]);
        const allFieldsFilled = addressKeys.every(key => !!billingAddress[key]);

        if (atLeastOneFieldFilled && !allFieldsFilled) {
            const errors = addressKeys.reduce((errorObj, key) => {
                if (!billingAddress[key]) {
                    errorObj[key] = t('required-all-address', { type: 'billing' });
                }

                return errorObj;
            }, {} as BillingAddress);

            return { billingAddress: errors };
        }

        return undefined;
    }

    return undefined;
};
