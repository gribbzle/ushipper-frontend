import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Link } from '../link';

import './help-page-link.scss';

const t = translateByNamespace('common:help-page-link');
const cn = classname('help-page-link');

export const HelpPageLink = () => (
    <h4 className={cn()}>
        {t('description')} <Link href='/'>{t('help-page')}</Link>.
    </h4>
);
