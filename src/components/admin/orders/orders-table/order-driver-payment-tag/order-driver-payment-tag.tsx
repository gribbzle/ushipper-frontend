import React from 'react';

import { FloatingDropdown, HelperText, OrderTag, Tooltip, TooltipContent, TooltipTrigger } from '@components';
import { ArrowDownIcon } from '@icons';
import { classname } from '@utils';

import { useOrderDriverPaymentTag } from './useOrderDriverPaymentTag';

import './order-driver-payment-tag.scss';

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
