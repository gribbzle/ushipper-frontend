import React, { useCallback } from 'react';

import { BackLink } from '@/components/common/back-link/back-link';
import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { PageTitle } from '@/components/common/page-title/page-title';
import { CheckIcon } from '@icons';
import { OrderFormEnum } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

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
