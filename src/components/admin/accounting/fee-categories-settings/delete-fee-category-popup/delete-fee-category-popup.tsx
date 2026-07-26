import React from 'react';

import { Button, Popup } from '@/components/common';
import { translateByNamespace } from '@utils';

import { useDeleteFeeCategoryPopup } from './use-delete-fee-category-popup';

const t = translateByNamespace('admin:accounting:fee-categories-settings:delete-fee-category-popup');
const tAction = translateByNamespace('client:orders-page:delete-order-popup');

export const DeleteFeeCategoryPopup = () => {
    const { onDeleteClickHandler, onClosePopupHandler, isVisible, feeCategoryName } = useDeleteFeeCategoryPopup();

    return (
        <Popup
            isOpen={isVisible}
            onClose={onClosePopupHandler}
            title={t('title', { feeCategoryName: feeCategoryName ?? t('default-fee-category-name') })}
            actions={
                <>
                    <Button view='danger' size='small' onClick={onDeleteClickHandler}>
                        {tAction('confirm-button-label')}
                    </Button>
                    <Button view='default' size='small' onClick={onClosePopupHandler}>
                        {tAction('cancel-button-label')}
                    </Button>
                </>
            }
        />
    );
};
