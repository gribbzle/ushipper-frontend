import React, { ReactNode } from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderStatus } from '@/enums';
import { classname } from '@utils/classname';

import './timeline-connector.scss';

type Props = {
    className?: string;
    hidden?: boolean;
    view?: 'default' | 'primary' | 'success' | 'warning' | OrderStatus;
    children?: ReactNode;
};

const cn = classname('timeline-connector');

export const TimelineConnector = ({ hidden, className, view = 'default', children }: Props) => {
    return <div className={cn('', { hidden, view: toKebabCase(view) }, [className])}>{children}</div>;
};
