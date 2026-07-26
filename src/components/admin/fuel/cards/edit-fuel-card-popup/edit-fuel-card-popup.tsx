import React, { useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { translateByNamespace } from '@utils';

import { EditFuelCardForm } from './edit-fuel-card-form';
import { useEditFuelCardPopup } from './use-edit-fuel-card-popup';

const t = translateByNamespace('admin:fuel:cards-page:edit-fuel-card-popup');

export const EditFuelCardPopup = () => {
    const { formRef, isPopupOpened, isLoading, fuelCard, handleSubmitClick, handleClosePopup } = useEditFuelCardPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick} disabled={isLoading} hasLoader={isLoading}>
                    {t('edit')}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup} disabled={isLoading}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [handleClosePopup, handleSubmitClick, isLoading],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onTop={true}
            onClose={handleClosePopup}
            title={t('title', { cardNumber: fuelCard?.number ?? '' })}
            description={<EditFuelCardForm formRef={formRef} onAfterSubmit={handleClosePopup} />}
            actions={actions}
        />
    );
};
