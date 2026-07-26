import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './timeline.scss';

const cn = classname('timeline');

type Props = {
    children: ReactNode;
    className?: string;
    horizontal?: boolean;
};

export const Timeline = ({ children, className, horizontal }: Props) => <ul className={cn('', { horizontal }, [className])}>{children}</ul>;
