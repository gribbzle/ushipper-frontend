import React from 'react';

import { LockIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './inspection-stub.scss';

const cn = classname('inspection-stub-container');
const t = translateByNamespace('client:order:inspection');

export const InspectionStub = () => (
    <div className={cn()}>
        <LockIcon />
        <p>{t('inspection-stub-text')}</p>
    </div>
);
