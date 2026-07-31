import React, { MouseEvent } from 'react';

import { classname } from '@utils/classname';

import './counter-link.scss';

const cn = classname('counter-link');

type CounterLinkProps = {
    amount: number;
    children: string;
    onClick?: (e: MouseEvent) => void;
};

export const CounterLink = ({ amount, children, onClick }: CounterLinkProps) => {
    return (
        <div onClick={onClick} className={cn('', { empty: !amount })}>
            {amount} {children}
        </div>
    );
};
