import React, { useMemo } from 'react';

import { FuelCardLimits, FuelCardStatusTag, useOpenEditFuelCardPopup } from '@/components/admin/fuel';
import { HelperText } from '@/components/common/table/common/helper-text/helper-text';
import { TableColumn } from '@/components/common/table/table.types';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { useFuelCardsActionsPermission } from '@/hooks/fuel/use-fuel-cards-actions-permission';
import { useFuelCardsViewPermission } from '@/hooks/fuel/use-fuel-cards-view-permission';
import { FuelCard } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DataTableBlock } from '../data-table-block';

import { FuelCardsBlockProps } from './fuel-cards-block.types';
import { useFuelCardsBlock } from './use-fuel-cards-block';

import './fuel-cards-block.scss';

const cn = classname('fuel-cards-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements:fuel-cards-table');
const tFuel = translateByNamespace('admin:fuel:cards-page:table');
const tTable = translateByNamespace('common:staff-table');

export const FuelCardsBlock = ({ accountId, accountName }: FuelCardsBlockProps) => {
    const { onUnassignDriverClickHandler, onAddFuelCardClickHandler, fuelCards, isSuccess } = useFuelCardsBlock({ accountId, accountName });
    const hasFuelCardsActionsPermission = useFuelCardsActionsPermission();
    const hasFuelCardsViewPermission = useFuelCardsViewPermission();
    const editClickHandler = useOpenEditFuelCardPopup();

    const columns = useMemo<TableColumn<FuelCard>[]>(
        () => [
            {
                key: 'number',
                name: tFuel('number-column-name'),
                cellRender: ({ row: { number, wexAccount } }) => (
                    <div className={cn('number')}>
                        <p>{number}</p>
                        <HelperText text={wexAccount} />
                    </div>
                ),
            },
            {
                key: 'status',
                name: tTable('status-column-name'),
                cellRender: ({ row: { status, id } }) => <FuelCardStatusTag status={status} id={id} />,
            },
            {
                key: 'limit',
                name: tFuel('limit-column-name'),
                cellRender: ({ row: { limit, limitDef, limitDefGal, limitUlsdGal } }) => (
                    <FuelCardLimits limit={limit} limitUlsdGal={limitUlsdGal} limitDef={limitDef} limitDefGal={limitDefGal} />
                ),
            },
            {
                key: 'available',
                name: tFuel('available-column-name'),
                cellRender: ({ row: { available } }) => {
                    const { def, defGal, ulsd, ulsdGal } = available || {};

                    return <FuelCardLimits limit={ulsd} limitUlsdGal={ulsdGal} limitDef={def} limitDefGal={defGal} />;
                },
            },
            {
                key: 'actions',
                name: '',
                hide: !hasFuelCardsActionsPermission,
                cellRender: ({ row }) => (
                    <TableRowMenu
                        dataTestId='fuel-card-actions'
                        options={[
                            {
                                label: tFuel('edit-limit-action'),
                                onClick: () => editClickHandler(row),
                            },
                            {
                                label: t('delete-action'),
                                onClick: () => onUnassignDriverClickHandler(row),
                            },
                        ]}
                    />
                ),
                headerCellClassName: cn('actions'),
            },
        ],
        [hasFuelCardsActionsPermission, editClickHandler, onUnassignDriverClickHandler],
    );

    if (!hasFuelCardsViewPermission || !isSuccess) {
        return null;
    }

    return (
        <DataTableBlock<FuelCard>
            titleLabel={t('fuel-cards-label')}
            columns={columns}
            data={fuelCards}
            emptyStateText={t('fuel-cards-empty-alert')}
            onAddBtn={hasFuelCardsActionsPermission ? onAddFuelCardClickHandler : undefined}
        />
    );
};
