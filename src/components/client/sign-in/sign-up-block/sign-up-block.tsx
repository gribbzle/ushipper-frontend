import React from 'react';

import { Link } from '@components';
import { classname, translateByNamespace } from '@utils';

import './sign-up-block.scss';

const t = translateByNamespace('client:sign-in-page');
const cn = classname('sign-up-block');

export const SignUpBlock = () => (
    <div className={cn('')}>
        {t('form.dont-have-account')}{' '}
        <Link href='/client/sign-up' as='/sign-up'>
            {t('form.sign-up-link')}
        </Link>
    </div>
);
