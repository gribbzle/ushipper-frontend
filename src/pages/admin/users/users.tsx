import React from 'react';
import Head from 'next/head';

import { CreateEditStaffDrawer, DeleteUserPopup, getMainLayout, StaffFiltersForm, StaffTable } from '@components';
import { useHasPermission, useUsersPage } from '@hooks';
import { classname, getProjectName, translateByNamespace } from '@utils';

import './users.scss';

const ACTIONS_PERMISSION = { scope: 'adminPanel', functionality: 'admin_panel.users.actions' };

const t = translateByNamespace('admin:users-page');
const cn = classname('users-page');

const UsersPage = () => {
    const { onModalCloseHandler, filtersReady, isCreateEditUserModalVisible, fetchUser } = useUsersPage('users');
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    if (!filtersReady) {
        return null;
    }

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>

            <StaffFiltersForm isEmailFieldVisible={true} isCompanyFieldVisible={true} />
            <StaffTable pageName='users' onRowClick={fetchUser} disabled={!hasPermission} />

            {hasPermission && (
                <>
                    <CreateEditStaffDrawer isOpen={isCreateEditUserModalVisible} onClose={onModalCloseHandler} pageId='users' />
                    <DeleteUserPopup />
                </>
            )}
        </div>
    );
};

const PageHead = () => <div className={cn('head')}>{t('header')}</div>;

UsersPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.users.view_any' }],
});

export default UsersPage;
