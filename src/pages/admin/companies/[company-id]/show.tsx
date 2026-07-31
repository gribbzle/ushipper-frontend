import React from 'react';

import { CompanyOrdersTable, CompanyPageHead, getMainLayout } from '@components';
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
