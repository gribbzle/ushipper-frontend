import React, { useCallback, useMemo } from 'react';

import { CompanyStatusInfo } from '@/components/common/table/common/company-status-info/company-status-info';
import { PhoneEmailInfo } from '@/components/common/table/common/phone-email-info/phone-email-info';
import { TableColumn } from '@/components/common/table/table.types';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { UsersCountInfo } from '@/components/common/table/common/users-count-info/users-count-info';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { useCompaniesActionsPermission } from '@/hooks/companies/use-companies-actions-permission';
import { useOpenDeleteCompanyPopup } from '@/hooks/companies/use-open-delete-company-popup';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { useTable } from '@/hooks/use-table';
import { useAppDispatch } from '@store';
import { Company, fetchCompanyAction } from '@store/admin';
import { companiesActions } from '@store/admin/companies/slice';
import { useGetCompaniesQuery } from '@store/api/company-api';
import { formatDateOrGetDash } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:companies-page:table');

export const useCompaniesTable = () => {
    const dispatch = useAppDispatch();
    const { filters } = useQueryFilters({ orderDirection: OrderSortingDirection.DESC });
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();
    const hasPermission = useCompaniesActionsPermission();
    const onOpenDeleteCompanyPopup = useOpenDeleteCompanyPopup();

    const { data: companiesData, isSuccess, isFetching } = useGetCompaniesQuery({ ...filters });

    const columns = useMemo<TableColumn<Company>[]>(
        () => [
            { key: 'name', isSortable: true, name: t('company-column-title') },
            {
                key: 'type',
                name: t('type-column-title'),
                cellRender: ({ value }) => value,
            },
            {
                key: 'phone_and_email',
                name: t('phone-and-email-column-title'),
                cellRender: ({ row: { phone, email } }) => <PhoneEmailInfo phone={phone} email={email} />,
            },
            {
                key: 'users_count',
                name: t('users-count-column-title'),
                cellRender: ({ row: { name, usersCount } }) => <UsersCountInfo companyName={name} count={usersCount} />,
            },
            {
                key: 'owner',
                name: t('owner-column-title'),
                cellRender: ({ value }) => <UserInfoBlock {...value} />,
            },
            {
                key: 'status',
                name: t('status-column-title'),
                cellRender: ({ value }) => <CompanyStatusInfo companyStatus={value} />,
            },
            {
                key: 'created_at',
                name: t('created-at-column-title'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => formatDateOrGetDash(createdAt),
            },
            {
                key: 'updated_at',
                name: t('updated-at-column-title'),
                isSortable: true,
                cellRender: ({ row: { updatedAt } }) => (updatedAt ? formatDateOrGetDash(updatedAt) : '—'),
            },
            {
                key: 'actions',
                name: '',
                hide: !hasPermission,
                cellRender: ({ row: { publicId, name } }) => (
                    <TableRowMenu
                        dataTestId='companies-table-actions'
                        options={[
                            {
                                label: t('edit-action-label'),
                                onClick: () => {
                                    dispatch(fetchCompanyAction(publicId));
                                    dispatch(
                                        companiesActions.setCreateEditCompanyDrawerProps({
                                            isVisible: true,
                                            mode: 'edit',
                                            companyId: publicId,
                                        }),
                                    );
                                },
                            },
                            {
                                label: t('delete-action-label'),
                                onClick: () => onOpenDeleteCompanyPopup({ companyId: publicId, companyName: name }),
                            },
                        ]}
                    />
                ),
            },
        ],
        [dispatch, hasPermission, onOpenDeleteCompanyPopup],
    );

    const onRowClickHandler = useCallback(
        (company: Company) => {
            dispatch(fetchCompanyAction(company.publicId));
            dispatch(
                companiesActions.setCreateEditCompanyDrawerProps({
                    isVisible: true,
                    mode: 'edit',
                    companyId: company.publicId,
                }),
            );
        },
        [dispatch],
    );

    return {
        hasPermission,
        filters,
        columns,
        companiesData,
        isSuccess,
        isFetching,
        onPageChangeHandler,
        onOrderChangeHandler,
        onPerPageChangeHandler,
        onRowClickHandler,
    };
};
