import React, { useMemo } from 'react';

import { Button, FinancialAccountForm, Popup } from '@components';
import { classname, translateByNamespace } from '@utils';

import { useEditFinancialAccountPopup } from './use-edit-financial-account-popup';

import './edit-financial-account-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

const cn = classname('edit-financial-account-popup');

export const EditFinancialAccountPopup = () => {
    const { isPopupOpened, financialAccountFormId, isLoading, handleClosePopup } = useEditFinancialAccountPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' type='submit' form={financialAccountFormId} hasLoader={isLoading}>
                    {tActions('save')}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [handleClosePopup, isLoading, financialAccountFormId],
    );

    return (
        <Popup
            className={cn()}
            size='large'
            onTop={true}
            isOpen={isPopupOpened}
            onClose={handleClosePopup}
            title={t('title')}
            description={<FinancialAccountForm />}
            actions={actions}
        />
    );
};
