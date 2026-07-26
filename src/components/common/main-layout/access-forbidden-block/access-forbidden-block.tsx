import React from 'react';

import { classname } from '@utils';

import './access-forbidden-block.scss';

const cn = classname('access-forbidden-block');

export const AccessForbiddenBlock = () => (
    <div className={cn()}>
        <h1>403</h1>
        <h4>
            You do not have enough permissions to access this section.
            <br />
            Contact the Administrator.
        </h4>
    </div>
);
