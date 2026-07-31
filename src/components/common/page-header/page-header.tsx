import React from 'react';

import { classname } from '@utils/classname';

import './page-header.scss';

const cn = classname('page-header');

type Props = {
    children: React.ReactNode;
    className?: string;
};

export const PageHeader = ({ children, className }: Props) => <div className={cn('', [className])}>{children}</div>;
