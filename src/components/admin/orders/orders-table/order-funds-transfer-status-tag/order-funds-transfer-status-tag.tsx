import React from 'react';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { HelperText } from '@/components/common/table/common/helper-text/helper-text';
import { ArrowDownIcon } from '@icons';
import { classname } from '@utils/classname';

import { useOrderFundsTransferStatusTag } from './useOrderFundsTransferStatusTag';

import './order-funds-transfer-status-tag.scss';

const cn = classname('funds-transfer-status-tag');

export type OrderFundsTransferStatusTagProps = {
    inline?: boolean;
};

export const OrderFundsTransferStatusTag = ({ inline = false }: OrderFundsTransferStatusTagProps) => {
    const { view, options, label, disabled, helperText } = useOrderFundsTransferStatusTag();

    return (
        <div className={cn('wrapper', { inline })}>
            <FloatingDropdown dataTestId='funds-transfer-status-actions' options={options} disabled={disabled}>
                <OrderTag view={view} isHover={!disabled}>
                    {label} {!disabled && <ArrowDownIcon className={cn('dropdown-icon')} />}
                </OrderTag>
            </FloatingDropdown>
            {helperText && <HelperText text={helperText} />}
        </div>
    );
};
