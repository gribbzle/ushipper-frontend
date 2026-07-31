import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './catalog-info-wrapper.scss';

const cn = classname('catalog-info-wrapper');

export const CatalogInfoWrapper = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('', [className])}>{children}</div>
);
