import React, { useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import ExternalLinkIcon from '@/assets/icons/external-link.svg';

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
