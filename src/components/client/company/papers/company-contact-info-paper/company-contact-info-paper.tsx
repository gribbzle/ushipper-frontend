import React from 'react';

import { ContactInfo } from '@/components/common/contact-info/contact-info';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:company-page:contact-info');

export const CompanyContactInfoPaper = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return company && <Paper title={t('header')} body={<ContactInfo information={company} />} />;
};
