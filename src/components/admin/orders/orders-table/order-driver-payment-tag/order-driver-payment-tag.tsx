import React from 'react';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { HelperText } from '@/components/common/table/common/helper-text/helper-text';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { classname } from '@utils/classname';

import { useOrderDriverPaymentTag } from './useOrderDriverPaymentTag';

import './order-driver-payment-tag.scss';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';

const cn = classname('order-driver-payment-tag');

export const OrderDriverPaymentTag = () => {
    const { variant, options, label, disabled, time, tooltipContent } = useOrderDriverPaymentTag();

    return (
        <div className={cn()}>
            <FloatingDropdown dataTestId='driver-payment-actions' options={options} disabled={disabled}>
                <Tooltip>
                    <TooltipTrigger>
                        <OrderTag view={variant} isHover={!disabled}>
                            {label} {!disabled && <ArrowDownIcon className={cn('dropdown-icon')} />}
                        </OrderTag>
                    </TooltipTrigger>
                    {!!tooltipContent && <TooltipContent className={cn('tip')}>{tooltipContent}</TooltipContent>}
                </Tooltip>
            </FloatingDropdown>
            {time && <HelperText text={time} />}
        </div>
    );
};
