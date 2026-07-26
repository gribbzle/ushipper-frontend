import React from 'react';

import { FuelCardStatus } from '@/enums';
import { FloatingDropdown, StatusBlock, StatusBlockView } from '@components';
import { useFuelCardsActionsPermission } from '@hooks';
import { ArrowDownIcon } from '@icons';
import { getFuelCardStatusTranslate } from '@utils';

import { useFuelCardStatusTag } from './use-fuel-card-status-tag';

export type FuelCardStatusTagProps = {
    status: FuelCardStatus;
    id: number;
};

const statusViewMap: Record<FuelCardStatus, StatusBlockView> = {
    active: 'success',
    inactive: 'warning',
    deleted: 'danger',
    hold: 'blocked',
};

export const FuelCardStatusTag = ({ status, id }: FuelCardStatusTagProps) => {
    const hasActionsPermission = useFuelCardsActionsPermission();
    const { options } = useFuelCardStatusTag({ status, id });

    return (
        <FloatingDropdown dataTestId='fuel-cards-status-actions' options={options} disabled={!hasActionsPermission}>
            <StatusBlock view={statusViewMap[status]} isHover={hasActionsPermission}>
                {getFuelCardStatusTranslate(status)} {hasActionsPermission && <ArrowDownIcon width={14} height={14} />}
            </StatusBlock>
        </FloatingDropdown>
    );
};
