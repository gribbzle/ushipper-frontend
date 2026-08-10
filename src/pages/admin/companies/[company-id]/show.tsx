import React from 'react';

import { CompanyOrdersTable } from '@/components/admin/companies/company-orders-table/company-orders-table';
import { CompanyPageHead } from '@/components/admin/companies/company-page-head/company-page-head';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { classname } from '@utils/classname';

import './show.scss';

const cn = classname('company-page');

const ShowCompanyPage = () => {
    return (
        <div className={cn()}>
            <CompanyOrdersTable />
        </div>
    );
};

ShowCompanyPage.getLayout = getMainLayout({
    head: <CompanyPageHead />,
});

export default ShowCompanyPage;
