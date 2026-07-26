import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './card-content.scss';

type Props = {
    className?: string;
    children?: ReactNode;
};

const cn = classname('ui-card-content');

export const CardContent = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
