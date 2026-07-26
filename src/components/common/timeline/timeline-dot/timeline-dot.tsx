import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { HistoryItemEventName, OrderStatus } from '@/enums';
import { ColorValueHex } from '@/shared';
import { classname } from '@utils';

import './timeline-dot.scss';

const cn = classname('timeline-dot');

type Props = {
    className?: string;
    view?: 'default' | 'primary' | 'success' | 'warning' | 'gray' | 'primary-green' | OrderStatus | HistoryItemEventName;
    backgroundColor?: ColorValueHex;
    borderColor?: string;
    withoutBackground?: boolean;
    size?: 'mini' | 'default';
};

export const TimelineDot = ({ className, view = 'default', borderColor, backgroundColor, withoutBackground = false, size = 'default' }: Props) => (
    <div className={cn('', { view: toKebabCase(view), withoutBackground, size }, [className])} style={{ borderColor, backgroundColor }} />
);
