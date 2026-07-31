import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './assign.scss';

const cn = classname('assign');

type Props = {
    children?: ReactNode;
};

export const Assign = ({ children }: Props) => <div className={cn()}>{children}</div>;
