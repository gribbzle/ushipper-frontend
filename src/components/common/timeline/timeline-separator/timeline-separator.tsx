import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './timeline-separator.scss';

const cn = classname('timeline-separator');

type Props = {
    children: ReactNode;
};

export const TimelineSeparator = ({ children }: Props) => <div className={cn()}>{children}</div>;
