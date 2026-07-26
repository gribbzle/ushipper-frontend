import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './paper.scss';

type Props = {
    className?: string;
    children?: ReactNode;
};

const cn = classname('ui-paper');

export const Paper = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
