import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './inspection-stub.scss';
import LockIcon from '@/assets/icons/lock.svg';

const cn = classname('inspection-stub-container');
const t = translateByNamespace('client:order:inspection');

export const InspectionStub = () => (
    <div className={cn()}>
        <LockIcon />
        <p>{t('inspection-stub-text')}</p>
    </div>
);
