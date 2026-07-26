import React, { useCallback } from 'react';

import { BackLink, Button, PageHeader, PageTitle } from '@components';
import { CheckIcon } from '@icons';
import { OrderFormEnum } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:order:create-page');

const Header = () => {
    const handleSaveAndContinueClick = useCallback(async () => {
        await document.getElementById(OrderFormEnum.GENERAL)?.dispatchEvent(new Event('click', { cancelable: true, bubbles: true }));
    }, []);

    const handleSave = useCallback(async () => {
        await document.getElementById(OrderFormEnum.GENERAL_WITH_REDIRECT)?.dispatchEvent(new Event('click', { cancelable: true, bubbles: true }));
    }, []);

    return (
        <PageHeader>
            <BackLink />
            <PageTitle title={t('back-btn-label')} />
            <Button view='primary' size='medium' onClick={handleSave}>
                <CheckIcon /> {t('save-btn-label')}
            </Button>
            <Button size='medium' onClick={handleSaveAndContinueClick}>
                {t('save-and-continue-btn-label')}
            </Button>
        </PageHeader>
    );
};

export default Header;
