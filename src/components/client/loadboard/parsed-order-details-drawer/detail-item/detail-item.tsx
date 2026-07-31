import React, { FC, ReactNode, SVGProps } from 'react';
import has from 'has-values';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './detail-item.scss';

const cn = classname('detail-item');
const t = translateByNamespace('common:order');

type DetailItemProps = {
    label?: string;
    value?: ReactNode;
    valueClassName?: string;
    Icon?: FC<SVGProps<SVGSVGElement>>;
    actions?: ReactNode;
};

export const DetailItem = ({ label, value, valueClassName, Icon, actions }: DetailItemProps) => (
    <div className={cn('')}>
        {Icon && (
            <div className={cn('icon')}>
                <Icon />
            </div>
        )}
        {label && <span>{label}: </span>}
        <span className={valueClassName}>{value && has(value) ? value : t('no-data')}</span>
        {actions}
    </div>
);
