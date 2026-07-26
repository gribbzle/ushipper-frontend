import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './timeline-content.scss';

const cn = classname('timeline-content');

type Props = {
    className?: string;
    children: ReactNode;
};

export const TimelineContent = ({ children, className }: Props) => <div className={cn('', [className])}>{children}</div>;
