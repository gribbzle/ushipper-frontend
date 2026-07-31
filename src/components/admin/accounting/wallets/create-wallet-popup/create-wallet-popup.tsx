import React, { useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { translateByNamespace } from '@utils/i18n';

import { CreateWalletForm } from './create-wallet-form';
import { useWalletPopup } from './use-create-wallet-popup';

const t = translateByNamespace('admin:accounting:wallets-page:create-wallet-popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const CreateWalletPopup = () => {
    const { formRef, isPopupOpened, handleSubmitClick, closeCreateWalletPopup } = useWalletPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick}>
                    {tActions('save')}
                </Button>
                <Button view='default' size='small' onClick={() => closeCreateWalletPopup()}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [closeCreateWalletPopup, handleSubmitClick],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onTop={true}
            onClose={closeCreateWalletPopup}
            title={t('title')}
            description={<CreateWalletForm formRef={formRef} onAfterSubmit={closeCreateWalletPopup} />}
            actions={actions}
        />
    );
};
