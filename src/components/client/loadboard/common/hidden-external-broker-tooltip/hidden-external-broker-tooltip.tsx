import React from 'react';

import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { ExclamationCircleIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './hidden-external-broker-tooltip.scss';

const cn = classname('hidden-external-broker-tooltip');
const t = translateByNamespace('client:loadboard:item:external-shipper');

export const HiddenExternalBrokerTooltip = () => (
    <div className={cn('')}>
        <div className={cn('label')}>{t('external-shipper-trigger')}</div>
        <Tooltip>
            <TooltipTrigger>
                <ExclamationCircleIcon className={cn('icon')} />
            </TooltipTrigger>
            <TooltipContent className={cn('tip')}>{t('external-shipper-tip')}</TooltipContent>
        </Tooltip>
    </div>
);
