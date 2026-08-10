import React from 'react';

import { Button } from '@/components/common/button/button';
import { CloseButton } from '@/components/common/button/CloseButton';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { LinkFuelCardForm } from './link-fuel-card-form';
import { useLinkFuelCardPopup } from './use-link-fuel-card-popup';

import './link-fuel-card-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:link-fuel-card-popup');
const tDefaultName = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer');

const cn = classname('link-fuel-card-popup');

export const LinkFuelCardPopup = () => {
    const { formRef, isPopupOpened, driverName, handleSubmitClick, handleClosePopup } = useLinkFuelCardPopup();

    return (
        <Popup
            className={cn()}
            isOpen={isPopupOpened}
            onTop={true}
            onClose={handleClosePopup}
            title={t('title', { name: driverName ?? tDefaultName('default-title') })}
            description={<LinkFuelCardForm formRef={formRef} onAfterSubmit={handleClosePopup} />}
            actions={
                <>
                    <Button view='primary' size='small' onClick={handleSubmitClick}>
                        {t('link')}
                    </Button>
                    <CloseButton onClick={handleClosePopup} />
                </>
            }
        />
    );
};
