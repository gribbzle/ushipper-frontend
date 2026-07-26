import React, { useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { useAppSelector } from '@store';
import { isCreateTransactionLoadingSelector } from '@store/admin';
import { translateByNamespace } from '@utils';

import { CreateTransactionForm, CreateTransactionFormProps } from './create-transaction-form';
import { useCreateTransactionPopup } from './use-create-transaction-popup';

const t = translateByNamespace('admin:accounting:factoring-balance:create-transaction-popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const CreateTransactionPopup = ({ context }: Pick<CreateTransactionFormProps, 'context'>) => {
    const { formRef, isPopupOpened, disabledSourceWallet, handleSubmitClick, closeCreateTransactionPopup } = useCreateTransactionPopup();
    const isLoading = useAppSelector(isCreateTransactionLoadingSelector);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick} disabled={isLoading} hasLoader={isLoading}>
                    {tActions('save')}
                </Button>
                <Button view='default' size='small' onClick={() => closeCreateTransactionPopup()} disabled={isLoading}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [closeCreateTransactionPopup, handleSubmitClick, isLoading],
    );

    return (
        <Popup
            size='large'
            isOpen={isPopupOpened}
            onTop={true}
            onClose={closeCreateTransactionPopup}
            title={t('title')}
            description={
                <CreateTransactionForm
                    formRef={formRef}
                    onAfterSubmit={closeCreateTransactionPopup}
                    context={context}
                    disabledSourceWallet={disabledSourceWallet}
                />
            }
            actions={actions}
        />
    );
};
