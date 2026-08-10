import React, { useCallback } from 'react';
import Head from 'next/head';

import { ContactSearch } from '@/components/client/contacts/contact-search/contact-search';
import { ContactsTable } from '@/components/client/contacts/contacts-table/contacts-table';
import { CreateEditContactDrawer } from '@/components/client/contacts/creat-edit-contact-drawer/create-edit-contacts-drawer';
import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useEffectOnce } from '@/hooks/use-effect-once';
import { useAppDispatch, useAppSelector } from '@store';
import {
    fetchContactAction,
    fetchContactsAction,
    fetchedContactsSelector,
    fetchedContactsStatusSelector,
    isCreateEditContactModalVisibleSelector,
} from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { getProjectName } from '@utils/translate/get-project-name';

import './contacts.scss';

const t = translateByNamespace('admin:contacts-page');
const cn = classname('contacts-page');

const ContactsPage = () => {
    const dispatch = useAppDispatch();
    const fetchedContacts = useAppSelector(fetchedContactsSelector);
    const fetchedContactsStatus = useAppSelector(fetchedContactsStatusSelector);

    useEffectOnce(() => {
        dispatch(fetchContactsAction());
    }, []);

    const isCreateEditContactModalVisible = useAppSelector(isCreateEditContactModalVisibleSelector);

    const onModalCloseHandler = useCallback(() => {
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: false, mode: null, contactId: null }));
    }, [dispatch]);

    const fetchContacts = useCallback(() => {
        dispatch(fetchContactsAction());
    }, [dispatch]);

    const fetchContact = useCallback(
        (id: number) => {
            dispatch(fetchContactAction(id));
        },
        [dispatch],
    );

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            {fetchedContactsStatus === RequestStatus.SUCCESS ? (
                <>
                    {fetchedContacts.length > 0 ? (
                        <ContactsTable
                            pageName='administrators'
                            onPageChange={fetchContacts}
                            onSortChange={fetchContacts}
                            onRowClick={fetchContact}
                            fetchedContacts={fetchedContacts}
                        />
                    ) : (
                        <EmptyLayout title={t('no-contacts')} />
                    )}
                </>
            ) : null}
            <CreateEditContactDrawer isOpen={isCreateEditContactModalVisible} onClose={onModalCloseHandler} pageId='administrators' />
        </div>
    );
};

const PageHead = () => (
    <div className={cn('head')}>
        {t('header')}
        <ContactSearch />
    </div>
);

ContactsPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.contacts.view_any' }],
});

export default ContactsPage;
