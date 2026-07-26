import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './timeline-item.scss';

const cn = classname('timeline-item');

type Props = {
    children: ReactNode;
    className?: string;
    size?: 'mini' | 'default';
};

export const TimelineItem = ({ children, className, size = 'default' }: Props) => <li className={cn('', { size }, [className])}>{children}</li>;
