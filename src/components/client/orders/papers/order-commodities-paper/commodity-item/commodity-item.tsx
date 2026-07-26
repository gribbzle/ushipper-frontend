import React from 'react';

import { useCanManageOrder } from '@/hooks/order';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { CommodityDetails, IconButton } from '@components';
import { PencilIcon, TrashIcon } from '@icons';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils';

import './commodity-item.scss';

const cn = classname('commodity-item');

type CommodityItemProps = {
    className?: string;
    commodity: OrderCommodity;
    onDeleteCommodityClick: () => void;
    onEditCommodityClick: () => void;
};

export const CommodityItem = ({ commodity, className, onDeleteCommodityClick, onEditCommodityClick }: CommodityItemProps) => {
    const canPerformActions = useCanManageOrder();
    const isDisabled = useDisableProductChanging();

    return (
        <div key={commodity.publicId} className={cn('', [className])}>
            <CommodityDetails commodity={commodity} />

            {!canPerformActions || isDisabled ? null : (
                <div className={cn('actions')}>
                    <IconButton Icon={PencilIcon} onClick={onEditCommodityClick} />
                    <div className={cn('tip-icon')}>
                        <IconButton Icon={TrashIcon} onClick={onDeleteCommodityClick} />
                    </div>
                </div>
            )}
        </div>
    );
};
