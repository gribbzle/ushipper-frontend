import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AddFuelCardToDriverForm } from './add-fuel-card-to-driver-form';
import { useAddFuelCardToDriverPopup } from './use-add-fuel-card-to-driver-popup';

import './add-fuel-card-to-driver-popup.scss';

const t = translateByNamespace('admin:fuel:cards-page:add-fuel-card-to-driver-popup');
const cn = classname('add-fuel-card-to-driver-popup');

export const AddFuelCardToDriverPopup = () => {
    const { formRef, isPopupOpened, fuelCard, handleSubmitClick, handleClosePopup } = useAddFuelCardToDriverPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick}>
                    {t('assign')}
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
            title={t('title', { number: fuelCard?.number ?? '' })}
            description={<AddFuelCardToDriverForm formRef={formRef} onAfterSubmit={handleClosePopup} />}
            actions={actions}
        />
    );
};
