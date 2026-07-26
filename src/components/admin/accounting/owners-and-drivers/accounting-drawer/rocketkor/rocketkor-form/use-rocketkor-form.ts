import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, savedDocumentsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import {
    accountsApi,
    useCreateAccountingProfileMutation,
    useSendAccountingProfileDocumentMutation,
    useUpdateAccountingProfileMutation,
} from '@store/api/accounts-api';
import { getObjectWithoutEmptyFields, handleError, splitName, translateByNamespace } from '@utils';

import { useGetAccountingProfile, useHandleCloseAccountingDrawer } from '../../hooks';
import { RocketkorFormValue } from '../rocketkor.types';

import { compareAddresses, getMailingAddressValues } from './utils';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

const DEFAULT_STATIC_TYPE = 'business';
const DEFAULT_STATIC_TAX_ID_COUNTRY_CODE = 'USA';
const DEFAULT_COUNTRY = 'USA';

export const useRocketkorForm = (handleCloseForm?: () => void) => {
    const rocketkorFormId = 'rocketkorFormId';

    const { accountingProfile, account } = useGetAccountingProfile();
    const [createAccountingProfile] = useCreateAccountingProfileMutation();
    const [updateAccountingProfile] = useUpdateAccountingProfileMutation();
    const dispatch = useAppDispatch();
    const savedDocuments = useAppSelector(savedDocumentsSelector);
    const [sendAccountingProfileDocument] = useSendAccountingProfileDocumentMutation();
    const { handleCloseDrawer } = useHandleCloseAccountingDrawer();

    const areAddressesSame = useMemo(
        () => compareAddresses(accountingProfile?.physicalAddress, accountingProfile?.mailingAddress),
        [accountingProfile?.mailingAddress, accountingProfile?.physicalAddress],
    );

    const initialValues = useMemo<Partial<RocketkorFormValue>>(() => {
        const { firstName, lastName } = account?.name ? splitName(account.name) : { firstName: '', lastName: '' };

        return accountingProfile
            ? { ...getObjectWithoutEmptyFields(accountingProfile), email: account?.email, areAddressesSame }
            : {
                  type: DEFAULT_STATIC_TYPE,
                  email: account?.email,
                  phone: account?.phone || '',
                  taxIdCountry: DEFAULT_STATIC_TAX_ID_COUNTRY_CODE,
                  areAddressesSame,
                  physicalAddress: { city: '', state: '', zipCode: '', addressLine1: '', addressLine2: '', country: DEFAULT_COUNTRY },
                  firstName,
                  lastName,
              };
    }, [account?.email, account?.phone, account?.name, accountingProfile, areAddressesSame]);

    const handleSubmit = useCallback(
        async ({ areAddressesSame, physicalAddress, mailingAddress, ...values }: RocketkorFormValue) => {
            try {
                if (account) {
                    const profile = {
                        ...values,
                        physicalAddress,
                        mailingAddress: getMailingAddressValues({ areAddressesSame, physicalAddress, mailingAddress }),
                        accountId: account?.publicId,
                    };

                    dispatch(accountingActions.setIsCreateAccountingProfileLoading(true));

                    if (accountingProfile) {
                        await updateAccountingProfile({
                            ...profile,
                            accountingProfileId: accountingProfile.publicId,
                        }).unwrap();
                    } else {
                        const { publicId } = await createAccountingProfile(profile).unwrap();

                        if (savedDocuments.length) {
                            const promises = savedDocuments.map(savedDocument => {
                                const {
                                    files,
                                    document: { attachment: _, ...fields },
                                } = savedDocument;

                                return sendAccountingProfileDocument({
                                    ...getObjectWithoutEmptyFields(fields),
                                    files,
                                    accountId: account.publicId,
                                    accountingProfileId: publicId,
                                }).unwrap();
                            });

                            await Promise.all(promises);

                            dispatch(accountingActions.clearSavedDocuments());
                        }
                    }

                    dispatch(accountsApi.util.invalidateTags([{ type: 'AccountingProfile', id: 'ID' }]));
                    dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));

                    toast.success<string>(accountingProfile ? t('update-profile-success') : t('create-profile-success'));

                    handleCloseForm?.();
                }
            } catch (exception) {
                handleError(exception);
            }

            dispatch(accountingActions.setIsCreateAccountingProfileLoading(false));
            if (!accountingProfile) {
                handleCloseDrawer();
            }
        },
        [
            account,
            accountingProfile,
            createAccountingProfile,
            dispatch,
            handleCloseForm,
            savedDocuments,
            sendAccountingProfileDocument,
            updateAccountingProfile,
            handleCloseDrawer,
        ],
    );

    return {
        initialValues,
        rocketkorFormId,
        handleSubmit,
    };
};
