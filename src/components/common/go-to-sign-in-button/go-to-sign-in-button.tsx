import React from 'react';

import { Button, Link } from '@components';
import { ArrowRightIcon } from '@icons';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:go-to-sign-in-button');

export const GoToSignInButton = () => (
    <Link href='/client/sign-in' as='/sign-in'>
        <Button type='button' view='primary'>
            {t('go-to-sign-in-page')}
            <ArrowRightIcon style={{ marginLeft: '6px' }} />
        </Button>
    </Link>
);
