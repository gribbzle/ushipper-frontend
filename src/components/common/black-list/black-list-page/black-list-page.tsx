import React from 'react';

import { getMainLayout } from '@components';

import { BlackListPageHead } from '../black-list-head';
import { BlackListPageLayout } from '../black-list-page-layout';

const BlackListPage = () => <BlackListPageLayout />;

BlackListPage.getLayout = getMainLayout({
    head: <BlackListPageHead />,
});

export default BlackListPage;
