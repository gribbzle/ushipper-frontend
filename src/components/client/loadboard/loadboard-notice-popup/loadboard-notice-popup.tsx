import React, { useMemo } from 'react';

import { Button, Popup } from '@/components/common';
import { translateByNamespace } from '@utils';

import { useLoadboardNoticePopup } from './use-loadboard-notice-popup';

const t = translateByNamespace('client:loadboard:notice');

export const LoadboardNoticePopup = () => {
    const { handleCloseLoadboardNoticePopup, opened, description } = useLoadboardNoticePopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleCloseLoadboardNoticePopup}>
                    {t('got-it')}
                </Button>
                <Button view='default' size='small' onClick={handleCloseLoadboardNoticePopup}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [handleCloseLoadboardNoticePopup],
    );

    return <Popup isOpen={opened} onClose={handleCloseLoadboardNoticePopup} description={description} title={t('title')} actions={actions} />;
};
