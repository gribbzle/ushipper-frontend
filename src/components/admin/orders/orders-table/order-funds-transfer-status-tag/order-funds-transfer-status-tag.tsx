import React from 'react';

import { FloatingDropdown, HelperText, OrderTag } from '@components';
import { ArrowDownIcon } from '@icons';
import { classname } from '@utils';

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
