import React, { useMemo } from 'react';

import { Button, InitiateAccountPaymentMethodsPopup, Popup } from '@/components/common';
import { useAppSelector } from '@store';
import { isCreateTransactionLoadingSelector } from '@store/admin';
import { translateByNamespace } from '@utils';

import { CashOutTransactionForm } from './cash-out-transaction-form';
import { useCashOutTransactionPopup } from './use-cash-out-transaction-popup';

const t = translateByNamespace('client:wallet-page:cash-out-transaction-popup');

export const CashOutTransactionPopup = () => {
    const { formRef, isPopupOpened, handleSubmitClick, closeCashOutTransactionPopup } = useCashOutTransactionPopup();
    const isLoading = useAppSelector(isCreateTransactionLoadingSelector);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick} disabled={isLoading} hasLoader={isLoading}>
                    {t('save-btn')}
                </Button>
                <Button view='default' size='small' onClick={() => closeCashOutTransactionPopup()} disabled={isLoading}>
                    {t('cancel-btn')}
                </Button>
            </>
        ),
        [closeCashOutTransactionPopup, handleSubmitClick, isLoading],
    );

    return (
        <>
            <Popup
                isOpen={isPopupOpened}
                onClose={closeCashOutTransactionPopup}
                title={t('title')}
                description={<CashOutTransactionForm formRef={formRef} onAfterSubmit={closeCashOutTransactionPopup} />}
                actions={actions}
            />
            <InitiateAccountPaymentMethodsPopup />
        </>
    );
};
