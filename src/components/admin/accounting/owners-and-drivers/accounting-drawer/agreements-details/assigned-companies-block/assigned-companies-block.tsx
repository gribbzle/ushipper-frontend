import React, { useMemo } from 'react';

import { CompanyNameIsPartnerInfo } from '@/components/common/table/common/company-name-is-partner-info/company-name-is-partner-info';
import { DateInfo } from '@/components/common/table/common/date-info/date-info';
import { TableColumn } from '@/components/common/table/table.types';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { UserRoleType } from '@/enums/user-role-type';
import { useDriversActionsPermission } from '@hooks';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DataTableBlock } from '../data-table-block';

import { useAssignedCompaniesBlock } from './use-assigned-companies-block';

import './assigned-companies-block.scss';

const cn = classname('assigned-companies-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements:assigned-companies-table');

export const AssignedCompaniesBlock = ({ users = [] }: { users?: AccountingAccountUserData[] }) => {
    const { onAssignDispatcherClickHandler, onUnAssignDispatcherClickHandler, onDeleteClickHandler, onOpenAddDriverToCompanyPopupClickHandler } =
        useAssignedCompaniesBlock();
    const hasDriversActionsPermission = useDriversActionsPermission();

    const columns = useMemo<TableColumn<AccountingAccountUserData>[]>(
        () => [
            {
                key: 'company',
                name: t('company-column-title'),
                cellRender: ({ row: { company } }) =>
                    company ? <CompanyNameIsPartnerInfo name={company.name} isPartner={company.isPartner} trimCompanyName={true} /> : '—',
            },
            {
                key: 'superior_user',
                name: t('parent-user-column-title'),
                cellRender: ({ row: { superiorUser } }) => {
                    if (!superiorUser) {
                        return <>—</>;
                    }

                    const { role, avatar, name } = superiorUser;

                    return <UserInfoBlock name={name} avatar={avatar} role={role.name} trimName={true} />;
                },
            },
            {
                key: 'created_at',
                name: t('assigned-to-company-at-column-title'),
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('created-at'),
            },
            {
                key: 'actions',
                name: '',
                hide: !hasDriversActionsPermission,
                cellRender: ({ row }) => {
                    const { superiorUser } = row;
                    const isDispatcherSuperiorUser = superiorUser?.role.type === UserRoleType.CARRIER_DISPATCHER;

                    return (
                        <TableRowMenu
                            dataTestId='assigned-companies-table-actions'
                            options={[
                                {
                                    label: t('assign-dispatcher-button-label'),
                                    show: !!superiorUser && !isDispatcherSuperiorUser,
                                    onClick: () => onAssignDispatcherClickHandler({ user: row }),
                                },
                                {
                                    label: t('reassign-dispatcher-button-label'),
                                    show: isDispatcherSuperiorUser,
                                    onClick: () => onAssignDispatcherClickHandler({ user: row, reassign: true }),
                                },
                                {
                                    label: t('un-assign-dispatcher-button-label'),
                                    show: isDispatcherSuperiorUser,
                                    onClick: () => onUnAssignDispatcherClickHandler(row),
                                },
                                {
                                    label: t('delete-button-label'),
                                    onClick: () => onDeleteClickHandler(row),
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [hasDriversActionsPermission, onAssignDispatcherClickHandler, onDeleteClickHandler, onUnAssignDispatcherClickHandler],
    );

    return (
        <DataTableBlock<AccountingAccountUserData>
            titleLabel={t('assigned-companies-label')}
            columns={columns}
            data={users}
            emptyStateText={t('assigned-companies-empty-alert')}
            onAddBtn={hasDriversActionsPermission ? () => onOpenAddDriverToCompanyPopupClickHandler() : undefined}
            className={cn()}
        />
    );
};
