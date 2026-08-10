import React, { useCallback } from 'react';
import Head from 'next/head';

import { UserRoleGroup } from '@/enums';
import { Button } from '@/components/common/button/button';
import { CreateEditStaffDrawer } from '@/components/client/staff/create-edit-staff-drawer/create-edit-staff-drawer';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { StaffFiltersForm } from '@/components/client/staff/staff-filters/staff-filters';
import { StaffTable } from '@/components/client/staff/staff-table/staff-table';
import { useUsersPage } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch } from '@store';
import { staffActions } from '@store/common/staff/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './administrators.scss';

const t = translateByNamespace('admin:administrators-page');
const cn = classname('administrators-page');

const AdministratorsPage = () => {
    const { onModalCloseHandler, filtersReady, isCreateEditUserModalVisible, fetchUser } = useUsersPage('administrators');

    if (!filtersReady) {
        return null;
    }

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>

            <StaffFiltersForm />
            <StaffTable pageName={UserRoleGroup.ADMINISTRATORS} onRowClick={fetchUser} />

            <CreateEditStaffDrawer isOpen={isCreateEditUserModalVisible} onClose={onModalCloseHandler} pageId={UserRoleGroup.ADMINISTRATORS} />
            <DeleteUserPopup />
        </div>
    );
};

const PageHead = () => {
    const dispatch = useAppDispatch();

    const onAddUserClickHandler = useCallback(() => {
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch]);

    return (
        <div className={cn('head')}>
            <span>{t('header')}</span>
            <Button view='primary' size='medium' onClick={onAddUserClickHandler}>
                <PlusCircleIcon /> {t('add-admin-button')}
            </Button>
        </div>
    );
};

AdministratorsPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.administration.administrators.view_any' }],
});

export default AdministratorsPage;
