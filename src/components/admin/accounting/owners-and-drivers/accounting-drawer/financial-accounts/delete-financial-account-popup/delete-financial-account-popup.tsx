import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { translateByNamespace } from '@utils/i18n';

import { useDeleteFinancialAccountPopup } from './use-delete-financial-account-popup';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:popup');
const fuT = translateByNamespace('common:file-uploader');

export const DeleteFinancialAccountPopup = () => {
    const { handleFinancialAccountDelete, handleClose, deleteBalance, isPopupOpened } = useDeleteFinancialAccountPopup();

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='danger' onClick={handleFinancialAccountDelete}>
                    {fuT('delete')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {fuT('cancel')}
                </Button>
            </>
        ),
        [handleClose, handleFinancialAccountDelete],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onClose={handleClose}
            title={t('delete-confirmation', { name: deleteBalance?.name ?? t('default-financial-account-name') })}
            actions={actions}
        />
    );
};
