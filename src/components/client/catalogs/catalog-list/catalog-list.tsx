import React from 'react';

import { classname } from '@utils/classname';

import { CatalogListProps } from './catalog-list.types';

import './catalog-list.scss';

const cn = classname('catalog-list');

export const CatalogList = <T extends { publicId: string }>({ items, CatalogItem }: CatalogListProps<T>) => (
    <div className={cn()}>
        {items.map(item => (
            <CatalogItem key={item.publicId} info={item} />
        ))}
    </div>
);
