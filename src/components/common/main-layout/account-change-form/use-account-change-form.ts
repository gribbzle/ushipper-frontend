import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-final-form';
import { toast } from 'react-toastify';

import { CompanyType } from '@/enums';
import { useRouterForAccountChange } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { changeAccountSubmit } from '@store/client';
import { accountsUsersSelector } from '@store/client/accounts';
import { authorizedUserPublicIdSelector } from '@store/global';
import { translateByNamespace } from '@utils';

import { AccountChangeFormState } from './account-change-form.types';

const t = translateByNamespace('common:sidebar.notification');

export const useAccountChangeForm = () => {
    const userPublicId = useAppSelector(authorizedUserPublicIdSelector);
    const [account, setAccount] = useState<string | undefined>(userPublicId);
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const { redirectToStartPage } = useRouterForAccountChange();
    const redirectToStartPageRef = useRef(redirectToStartPage);

    const dispatch = useAppDispatch();

    const formState = useFormState<AccountChangeFormState>();
    const formStateModifierRef = useRef(formState.modified);

    const handleOnChange = useCallback(({ account }: AccountChangeFormState) => {
        const modifiedFields = formStateModifierRef.current;

        if (modifiedFields?.account) {
            setAccount(account);
        }
    }, []);

    const changeAccount = useCallback(
        (isNewAccountDispatcher: boolean, account: string) => {
            dispatch(changeAccountSubmit({ publicId: account }))
                .unwrap()
                .then(() => {
                    if (!isNewAccountDispatcher) {
                        redirectToStartPageRef.current(isNewAccountDispatcher);
                    }

                    toast.success(t<string>('account-change-success'));
                })
                .catch(() => {
                    toast.error(t<string>('account-change-error'));
                });
        },
        [dispatch, redirectToStartPageRef],
    );

    useEffect(() => {
        const modifiedFields = formStateModifierRef.current;

        if (account && modifiedFields?.account) {
            const newAccount = fetchedAccounts?.find(item => item.publicId === account);

            const isNewAccountDispatcher =
                !!newAccount?.company && [CompanyType.DISPATCHER, CompanyType.DRIVER].includes(newAccount.company.type as CompanyType);

            if (isNewAccountDispatcher) {
                redirectToStartPageRef.current(isNewAccountDispatcher).then(() => changeAccount(isNewAccountDispatcher, account));
            } else {
                changeAccount(isNewAccountDispatcher, account);
            }
        }
    }, [account, changeAccount, dispatch, fetchedAccounts]);

    useEffect(() => {
        redirectToStartPageRef.current = redirectToStartPage;
    }, [redirectToStartPage]);

    useEffect(() => {
        formStateModifierRef.current = formState.modified;
    }, [formState.modified]);

    return {
        handleOnChange,
    };
};
