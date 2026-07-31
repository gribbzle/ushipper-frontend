import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AssignUserDrawer } from '@/components';
import { InviteUserDrawer } from '@/components/client/staff/invite-user-drawer/invite-user-drawer';
import { StaffTableView } from '@/components/client/staff/staff-filters/staff-filters.types';
import { Button, CreateEditStaffDrawer, DeleteUserPopup, getMainLayout, StaffFiltersForm, StaffTable } from '@components';
import { useUsersPage } from '@hooks';
import { PlusCircleIcon, SendIcon } from '@icons';
import { useAppDispatch } from '@store';
import { staffActions } from '@store/common/staff/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './staff.scss';

const t = translateByNamespace('client:staff-page');
const cn = classname('staff-page');

const StaffPage = () => {
    const [view, setView] = useState<StaffTableView>('tree');

    const { onModalCloseHandler, filtersReady, isCreateEditUserModalVisible, fetchUser } = useUsersPage('staff');

    if (!filtersReady) {
        return null;
    }

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>

            <StaffFiltersForm isRoleFieldVisible={true} onViewChange={setView} />
            <StaffTable view={view} pageName='staff' onRowClick={fetchUser} />

            <CreateEditStaffDrawer isOpen={isCreateEditUserModalVisible} onClose={onModalCloseHandler} pageId='staff' />
            <AssignUserDrawer />
            <InviteUserDrawer />
            <DeleteUserPopup />
        </div>
    );
};

const PageHead = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleOpenInviteUserDrawer = useCallback(async () => {
        await router.push(
            {
                pathname: router.pathname,
                query: {
                    isInviteUserDrawerOpened: true,
                },
            },
            {
                pathname: router.asPath,
                query: {
                    isInviteUserDrawerOpened: true,
                },
            },
        );
    }, [router]);

    const onAddUserClickHandler = useCallback(() => {
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch]);

    return (
        <div className={cn('head')}>
            <span>{t('header')}</span>
            <Button view='primary' size='medium' onClick={onAddUserClickHandler}>
                <PlusCircleIcon /> {t('add-user-button')}
            </Button>
            <Button view='default' size='medium' onClick={handleOpenInviteUserDrawer}>
                <SendIcon /> {t('invite-user')}
            </Button>
        </div>
    );
};

StaffPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [
        { scope: 'shipperAdministration', functionality: 'shipper.administration.staff.view_any' },
        { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
    ],
});

export default StaffPage;
