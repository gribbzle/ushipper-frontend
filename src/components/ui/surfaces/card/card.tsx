import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './card.scss';

type Props = {
    className?: string;
    children?: ReactNode;
};

const cn = classname('ui-card');

export const Card = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
