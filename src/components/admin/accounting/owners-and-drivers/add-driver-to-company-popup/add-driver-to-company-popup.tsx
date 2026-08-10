import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AddDriverToCompanyForm } from './add-driver-to-company-form';
import { useAddDriverToCompanyPopup } from './use-add-driver-to-company-popup';

import './add-driver-to-company-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:add-driver-to-company-popup');
const tDefaultName = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer');

const cn = classname('add-driver-to-company-popup');

export const AddDriverToCompanyPopup = () => {
    const { formRef, isPopupOpened, name, handleSubmitClick, handleClosePopup } = useAddDriverToCompanyPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick}>
                    {t('add')}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [handleClosePopup, handleSubmitClick],
    );

    return (
        <Popup
            className={cn()}
            isOpen={isPopupOpened}
            onTop={true}
            onClose={handleClosePopup}
            title={t('title', { name: name ?? tDefaultName('default-title') })}
            description={<AddDriverToCompanyForm formRef={formRef} onAfterSubmit={handleClosePopup} />}
            actions={actions}
        />
    );
};
