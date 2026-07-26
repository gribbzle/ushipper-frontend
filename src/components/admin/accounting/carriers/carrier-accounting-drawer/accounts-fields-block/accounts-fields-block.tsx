import React from 'react';

import { classname } from '@utils';

import { CentralDispatchFields } from './central-dispatch-fields';
import { SuperDispatchFields } from './super-dispatch-fields';

import './accounts-fields-block.scss';

const cn = classname('accounts-fields-block');

export const AccountsFieldsBlock = () => (
    <div className={cn('')}>
        <CentralDispatchFields />
        <SuperDispatchFields />
    </div>
);
