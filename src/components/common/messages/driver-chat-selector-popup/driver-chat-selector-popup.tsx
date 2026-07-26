import React, { useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { classname, RequestStatus, translateByNamespace } from '@utils';

import { DriverSelectorForm } from './driver-chat-selector-form';
import { useDriverChatSelectorPopup } from './use-driver-chat-selector-popup';

import './driver-chat-selector-popup.scss';

const t = translateByNamespace('common:messages-page:driver-chat-selector-popup');
const tCancel = translateByNamespace('admin:accounting:owners-and-drivers:add-driver-to-company-popup');
const cn = classname('driver-chat-selector-popup');

export const DriverChatSelectorPopup = () => {
    const { requestStatus, formRef, isPopupOpened, handleSubmitClick, handleClosePopup } = useDriverChatSelectorPopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmitClick} hasLoader={requestStatus === RequestStatus.PROCESSING}>
                    {t('start-chat')}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {tCancel('cancel')}
                </Button>
            </>
        ),
        [handleClosePopup, handleSubmitClick, requestStatus],
    );

    return (
        <Popup
            className={cn()}
            isOpen={isPopupOpened}
            onClose={handleClosePopup}
            title={t('title')}
            description={<DriverSelectorForm formRef={formRef} onAfterSubmit={handleClosePopup} />}
            actions={actions}
        />
    );
};
