import React, { useCallback } from 'react';
import Head from 'next/head';

import { useAppDispatch, useAppSelector } from '@store';
import { isCreateEditBlackListItemModalVisibleSelector } from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import { BlackListTable } from '../black-list-table';
import { CreateEditBlackListItemDrawer } from '../create-edit-black-list-item-drawer';
import { DeleteBlackListItemPopup } from '../delete-black-list-item-popup';

import './black-list-page-layout.scss';

const t = translateByNamespace('common:black-list-page');
const cn = classname('black-list-page');

export const BlackListPageLayout = () => {
    const dispatch = useAppDispatch();

    const isCreateEditUserModalVisible = useAppSelector(isCreateEditBlackListItemModalVisibleSelector);

    const onModalCloseHandler = useCallback(() => {
        dispatch(blackListActions.setCreateEditModalProps({ isVisible: false, mode: null, blackListPublicId: null }));
    }, [dispatch]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <BlackListTable />
            <CreateEditBlackListItemDrawer isOpen={isCreateEditUserModalVisible} onClose={onModalCloseHandler} />
            <DeleteBlackListItemPopup />
        </div>
    );
};
