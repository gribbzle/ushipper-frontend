import React from 'react';

import { CommodityDetails } from '@/components/common/commodity/commodity-details/commodity-details';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { useCanManageOrder } from '@/hooks/order/use-can-manage-order';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils/classname';

import './commodity-item.scss';
import PencilIcon from '@/assets/icons/pencil.svg';
import TrashIcon from '@/assets/icons/trash-can.svg';

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
