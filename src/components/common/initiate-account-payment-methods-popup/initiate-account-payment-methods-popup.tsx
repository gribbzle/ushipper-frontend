import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { Popup } from '@/components/common/popup/popup';
import { useAppSelector } from '@store';
import { isCreateAccountPaymentMethodsLoadingSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { InitiateAccountPaymentMethodsForm } from './initiate-account-payment-methods-form';
import { InitiatePaymentMethodInfo } from './initiate-payment-method-info';
import { useInitiateAccountPaymentMethodsPopup } from './use-initiate-account-payment-methods-popup';

const t = translateByNamespace('admin:accounting:initiate-account-payment-methods-popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const InitiateAccountPaymentMethodsPopup = () => {
    const { formRef, isPopupOpened, initiatePaymentMethodInfo, handleSubmitClick, closeInitiateAccountPaymentMethodsPopup } =
        useInitiateAccountPaymentMethodsPopup();
    const isLoading = useAppSelector(isCreateAccountPaymentMethodsLoadingSelector);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick} disabled={isLoading} hasLoader={isLoading}>
                    {tActions('save')}
                </Button>
                <Button view='default' size='small' onClick={() => closeInitiateAccountPaymentMethodsPopup()} disabled={isLoading}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [closeInitiateAccountPaymentMethodsPopup, handleSubmitClick, isLoading],
    );

    return (
        <Popup
            size='large'
            isOpen={isPopupOpened}
            onTop={true}
            onClose={closeInitiateAccountPaymentMethodsPopup}
            title={t('title')}
            description={
                <>
                    {initiatePaymentMethodInfo?.masspay && (
                        <>
                            <InitiatePaymentMethodInfo payer={initiatePaymentMethodInfo.masspay.payer} company={initiatePaymentMethodInfo.masspay.company} />
                            <Divider>{t('attributes')}</Divider>
                        </>
                    )}
                    <InitiateAccountPaymentMethodsForm formRef={formRef} onAfterSubmit={closeInitiateAccountPaymentMethodsPopup} />
                </>
            }
            actions={actions}
        />
    );
};
