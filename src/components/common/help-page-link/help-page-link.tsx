import React from 'react';

import { Link } from '@/components/common';
import { classname, translateByNamespace } from '@utils';

import './help-page-link.scss';

const t = translateByNamespace('common:help-page-link');
const cn = classname('help-page-link');

export const HelpPageLink = () => (
    <h4 className={cn()}>
        {t('description')} <Link href='/'>{t('help-page')}</Link>.
    </h4>
);
