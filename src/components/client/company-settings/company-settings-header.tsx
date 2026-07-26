import React, { useCallback } from 'react';

import { Button } from '@components';
import { ExternalLinkIcon } from '@icons';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';
import { classname, translateByNamespace } from '@utils';

const t = translateByNamespace('client:company-settings');
const cn = classname('company-settings-page');

export default function CompanySettingsHeader() {
    const user = useAppSelector(authorizedUserSelector);
    const openCompanyPreview = useCallback(async () => {
        if (user?.companyPublicId) {
            window.open(`/companies/${user.companyPublicId}`);
        }
    }, [user]);

    return (
        <div className={cn('header')}>
            <div>{t('header')}</div>
            <Button size='medium' onClick={openCompanyPreview}>
                <ExternalLinkIcon /> {t('view-company')}
            </Button>
        </div>
    );
}
