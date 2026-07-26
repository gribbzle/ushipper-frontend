import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Popup } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, deleteAccountPopupPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { useDeleteAccountMutation } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:delete-account-popup');
const tActions = translateByNamespace('common:file-uploader');

export const DeleteAccountPopup = () => {
    const dispatch = useAppDispatch();
    const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

    const onClosePopupHandler = useCallback(() => {
        dispatch(accountingActions.setDeleteAccountPopupProps({ isPopupOpened: false, accountId: null, accountName: null }));
    }, [dispatch]);

    const { isPopupOpened, accountId, accountName } = useAppSelector(deleteAccountPopupPropsSelector);

    const onDeleteAccountClickHandler = useCallback(async () => {
        if (accountId) {
            try {
                await deleteAccount(accountId).unwrap();

                onClosePopupHandler();
                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));

                toast.success(t<string>('delete-account-success'));
            } catch (error) {
                toast.error<string>(t('delete-account-error'));
            }
        }
    }, [accountId, deleteAccount, onClosePopupHandler, dispatch]);

    const actions = useMemo(
        () => (
            <>
                <Button disabled={isLoading} size='small' view='danger' onClick={onDeleteAccountClickHandler}>
                    {tActions('delete')}
                </Button>
                <Button size='small' onClick={onClosePopupHandler}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [onDeleteAccountClickHandler, onClosePopupHandler, isLoading],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onClose={onClosePopupHandler}
            title={t('title', { accountName: accountName ?? t('default-account-name') })}
            actions={actions}
        />
    );
};
