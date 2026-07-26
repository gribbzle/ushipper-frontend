import React, { ReactNode, useMemo } from 'react';

import { Accordion } from '@/components';
import { classname } from '@utils';

import './driver-item-tab.scss';

type Props = {
    title: string;
    head?: ReactNode;
    body: ReactNode;
    className?: string;
    opened?: boolean;
};

const cn = classname('driver-item-tab');

export const DriverItemTab = ({ title, body, head, className, opened }: Props) => {
    const header = useMemo(() => <span className={cn('title')}>{title}</span>, [title]);

    return (
        <Accordion opened={opened} title={header} rightAddon={head} className={className}>
            {body}
        </Accordion>
    );
};
