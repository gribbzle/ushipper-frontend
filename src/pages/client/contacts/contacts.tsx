import React, { useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import { Button, ContactSearch, ContactsTable, CreateEditContactDrawer, DeleteContactPopup, getMainLayout, Paper } from '@components';
import { useEffectOnce } from '@hooks';
import { ExternalLinkIcon, PlusCircleIcon } from '@icons';
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

const t = translateByNamespace('client:contacts-page');
const cn = classname('contacts-page');

const ContactsPage = () => {
    const dispatch = useAppDispatch();
    const params = useSearchParams();
    const fetchedContacts = useAppSelector(fetchedContactsSelector);
    const fetchedContactsStatus = useAppSelector(fetchedContactsStatusSelector);

    useEffectOnce(() => {
        dispatch(contactsActions.setFilters({ page: 1, search: params.get('search') }));
        dispatch(fetchContactsAction());
    }, []);

    const isCreateEditContactModalVisible = useAppSelector(isCreateEditContactModalVisibleSelector);

    const onModalCloseHandler = useCallback(() => {
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: false, mode: null, contactId: null }));
    }, [dispatch]);

    const onAddContactClickHandler = useCallback(() => {
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: true, mode: 'create', contactId: null }));
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

    const paperBody = useMemo(
        () => (
            <div className={cn('body-container')}>
                <span>{t('no-contacts')}</span>
                <Button view='primary' onClick={onAddContactClickHandler}>
                    <ExternalLinkIcon />
                    {t('add-contact-button')}
                </Button>
            </div>
        ),
        [onAddContactClickHandler],
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
                            pageName='contacts'
                            onPageChange={fetchContacts}
                            onSortChange={fetchContacts}
                            onRowClick={fetchContact}
                            fetchedContacts={fetchedContacts}
                        />
                    ) : (
                        <Paper body={paperBody} />
                    )}
                </>
            ) : null}
            <CreateEditContactDrawer isOpen={isCreateEditContactModalVisible} onClose={onModalCloseHandler} pageId='contacts' />
            <DeleteContactPopup />
        </div>
    );
};

const PageHead = () => {
    const dispatch = useAppDispatch();

    const onAddContactClickHandler = useCallback(() => {
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: true, mode: 'create', contactId: null }));
    }, [dispatch]);

    return (
        <div className={cn('head')}>
            <span>{t('header')}</span>
            <Button view='primary' size='medium' onClick={onAddContactClickHandler}>
                <PlusCircleIcon /> {t('add-contact-button')}
            </Button>
            <ContactSearch />
        </div>
    );
};

ContactsPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [
        { scope: 'carrierOrders', functionality: 'carrier.contacts.view_any' },
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.contacts.view_any' },
    ],
});

export default ContactsPage;
