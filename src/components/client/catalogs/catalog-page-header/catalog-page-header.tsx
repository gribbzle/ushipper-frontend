import React from 'react';

import { classname } from '@utils/classname';

const cn = classname('catalog-page');

export const CatalogPageHeader = ({ count, title }: { count?: string; title: string }) => (
    <div className={cn('header')}>
        {title}
        {!!count && <sup>({count})</sup>}
    </div>
);
