import React from 'react';

import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { StatusBlock } from '@/components/common/status-block/status-block';
import { StatusBlockView } from '@/components/common/status-block/status-block';
import { FuelCardStatus } from '@/enums/fuel/fuel-card-status-enum';
import { useFuelCardsActionsPermission } from '@/hooks/fuel/use-fuel-cards-actions-permission';
import { ArrowDownIcon } from '@icons';
import { getFuelCardStatusTranslate } from '@utils/translate/fuel/get-fuel-card-status-translate';

import { FuelCardStatusTagProps } from './fuel-card-status-tag.types';
import { useFuelCardStatusTag } from './use-fuel-card-status-tag';

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
