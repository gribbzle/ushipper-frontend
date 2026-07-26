import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './card-footer.scss';

type Props = {
    className?: string;
    children?: ReactNode;
};

const cn = classname('ui-card-footer');

export const CardFooter = ({ className, children }: Props) => <div className={cn('', [className])}>{children}</div>;
