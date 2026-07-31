import React, { memo, useCallback, useMemo } from 'react';
import { toCamelCase, toSnakeCase } from 'js-convert-case';
import { useRouter } from 'next/router';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { Link } from '@/components/common/link/link';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { Table } from '@/components/common/table/table';
import { TableColumn } from '@/components/common/table/table.types';
import { useAppDispatch, useAppSelector } from '@store';
import { Contact, contactsFiltersSelector } from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';
import { classname } from '@utils/classname';
import { formatDateOrGetDash } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import './contact-table.scss';

type ContactsTableProps = {
    onPageChange: () => void;
    onSortChange: () => void;
    onRowClick: (id: number) => void;
    fetchedContacts: Contact[];
    pageName: 'administrators' | 'contacts';
};

const t = translateByNamespace('common:staff-table');
const cn = classname('contact-table');

export const ContactsTable = memo(({ onPageChange, onSortChange, onRowClick, fetchedContacts, pageName }: ContactsTableProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isContactsPage = pageName === 'contacts';

    const columns = useMemo<TableColumn<Contact>[]>(() => {
        const columnList: TableColumn<Contact>[] = [
            { key: 'name', name: 'Name', isSortable: true, cellClassName: cn('name') },
            { key: 'phone', name: 'Phone', cellRender: ({ value }) => formatPhoneNumberIntl(value) },
            { key: 'email', name: 'Email' },
            {
                key: 'companyName',
                name: t('company-column-name'),
                hide: isContactsPage,
                cellRender: ({ value }) => <Link href={{ pathname: '/admin/companies', query: { name: value } }}>{value}</Link>,
            },
            { key: 'address', name: 'Address' },
            { key: 'createdAt', name: 'Created at', cellRender: ({ value }) => formatDateOrGetDash(value) },
            { key: 'updatedAt', name: 'Updated at', cellRender: ({ value }) => formatDateOrGetDash(value) },
        ];

        if (isContactsPage) {
            columnList.push({
                key: 'actions',
                name: '',
                cellRender: ({ row: { id, name } }) => (
                    <TableRowMenu
                        dataTestId='contacts-table-actions'
                        options={[
                            {
                                label: 'Edit',
                                onClick: () => {
                                    onRowClick(id);
                                    dispatch(contactsActions.setCreateEditModalProps({ isVisible: true, mode: 'edit', contactId: id }));
                                },
                            },
                            {
                                label: 'Delete',
                                onClick: () => {
                                    dispatch(contactsActions.setDeleteContactPopupProps({ isVisible: true, contactId: id, contactName: name }));
                                },
                            },
                        ]}
                    />
                ),
            });
        }

        return columnList;
    }, [dispatch, isContactsPage, onRowClick]);

    const filters = useAppSelector(contactsFiltersSelector);

    const onPageChangeHandler = useCallback(
        (page: number) => {
            dispatch(contactsActions.setFilters({ page }));
            onPageChange();
        },
        [dispatch, onPageChange],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            dispatch(contactsActions.setFilters({ perPage, page: 1 }));
            router.replace({ pathname: router.pathname, query: { ...router.query, perPage } });

            onPageChange();
        },
        [dispatch, onPageChange, router],
    );

    const onOrderChangeHandler = useCallback(
        (orderName: string, orderDirection: string) => {
            dispatch(contactsActions.setFilters({ orderName: toSnakeCase(orderName), orderDirection }));
            onSortChange();
            router.replace({ pathname: router.pathname, query: { ...router.query, orderName: toSnakeCase(orderName), orderDirection } });
        },
        [dispatch, onSortChange, router],
    );

    const onRowClickHandler = useCallback(
        (contact: Contact) => {
            onRowClick(contact.id);
            dispatch(contactsActions.setCreateEditModalProps({ isVisible: true, mode: 'edit', contactId: contact.id }));
        },
        [dispatch, onRowClick],
    );

    return (
        <Table<Contact>
            columns={columns}
            data={fetchedContacts}
            orderName={filters.orderName ? toCamelCase(filters.orderName) : null}
            orderDirection={filters.orderDirection}
            onOrderChange={onOrderChangeHandler}
            isRowClickable={() => true}
            onRowClick={onRowClickHandler}
            isSticky={true}
            paginationProps={{
                page: filters.page,
                perPage: filters.perPage,
                lastPage: filters?.lastPage,
                from: filters.from,
                to: filters.to,
                total: filters.total,
                onPageChange: onPageChangeHandler,
                onChangePerPage: onPerPageChangeHandler,
            }}
        />
    );
});

ContactsTable.displayName = 'ContactsTable';
