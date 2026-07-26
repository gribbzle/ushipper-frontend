import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './card-header.scss';

type Props = {
    className?: string;
    children?: ReactNode;
};

const cn = classname('ui-card-header');

export const CardHeader = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
