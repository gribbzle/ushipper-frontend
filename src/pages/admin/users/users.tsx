import React from 'react';
import Head from 'next/head';

import { CreateEditStaffDrawer } from '@/components/client/staff/create-edit-staff-drawer/create-edit-staff-drawer';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { StaffFiltersForm } from '@/components/client/staff/staff-filters/staff-filters';
import { StaffTable } from '@/components/client/staff/staff-table/staff-table';
import { useHasPermission } from '@/hooks/use-check-permission';
import { useUsersPage } from '@/hooks/users/use-users-page';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
