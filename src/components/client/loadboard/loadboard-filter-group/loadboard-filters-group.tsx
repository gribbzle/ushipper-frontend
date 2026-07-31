import React from 'react';

import { classname } from '@utils/classname';

import './loadboard-filters-group.scss';

const cn = classname('loadboard-filters-group');

interface Props extends React.PropsWithChildren {
    title: string;
}

export default function LoadboardFiltersGroup(props: Props) {
    return (
        <div className={cn()}>
            <div className={cn('title')}>{props.title}</div>
            <div className={cn('body')}>{props.children}</div>
        </div>
    );
}
