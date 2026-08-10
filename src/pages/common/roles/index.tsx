import React, { useCallback } from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { CreateUpdateRoleBlock } from '@/components/common/settings/roles/create-update-role-block/create-update-role-block';
import { DeleteRolePopup } from '@/components/common/settings/roles/delete-role-popup/delete-role-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { RolesTable } from '@/components/common/settings/roles/roles-table/roles-table';
import { useEffectOnce } from '@/hooks/use-effect-once';
import { PlusCircleIcon } from '@icons';
import { useAppDispatch } from '@store';
import { fetchRoleTypesAction } from '@store/common';
import { rolesSettingsActions } from '@store/common/roles-settings/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './roles.scss';

const t = translateByNamespace('common:roles-page');
const cn = classname('roles-page');

const RolesPage = () => {
    const dispatch = useAppDispatch();

    useEffectOnce(() => {
        dispatch(fetchRoleTypesAction());
    }, []);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('head-title', { projectName: getProjectName() })}</title>
            </Head>
            <RolesTable />
            <CreateUpdateRoleBlock />
            <DeleteRolePopup />
        </div>
    );
};

const PageHead = () => {
    const dispatch = useAppDispatch();

    const onAddRoleClickHandler = useCallback(() => {
        dispatch(rolesSettingsActions.resetClickedRowId());
        dispatch(rolesSettingsActions.setCreateUpdateRoleBlockProps({ mode: 'create', roleId: null }));
    }, [dispatch]);

    return (
        <div className={cn('head')}>
            {t('title')}
            <Button view='primary' size='medium' onClick={onAddRoleClickHandler}>
                <PlusCircleIcon /> {t('add-role-button')}
            </Button>
        </div>
    );
};

RolesPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [
        { scope: 'carrierAdministration', functionality: 'carrier.administration.role_settings.view_any' },
        { scope: 'shipperAdministration', functionality: 'shipper.administration.role_settings.view_any' },
        { scope: 'adminPanelSettings', functionality: 'admin_panel.administration.roles.view_any' },
    ],
});

export default RolesPage;
