import React, { ReactNode } from 'react';

import { classname } from '@utils';

const cn = classname('info-list-body');

import { PillTag } from '../../pill-tag';

import './info-list-body.scss';

export const InfoListBody = ({ items, renderItem }: { items?: string[]; renderItem?: (item: string) => ReactNode }) => {
    return <div className={cn('tags')}>{(items || []).map(item => (renderItem ? renderItem(item) : <PillTag key={item}>{item}</PillTag>))}</div>;
};
