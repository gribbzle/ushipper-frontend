import React from 'react';

import { ContactInfo, Paper } from '@components';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:company-page:contact-info');

export const CompanyContactInfoPaper = () => {
    const company = useAppSelector(fetchedCompanySelector);

    return company && <Paper title={t('header')} body={<ContactInfo information={company} />} />;
};
