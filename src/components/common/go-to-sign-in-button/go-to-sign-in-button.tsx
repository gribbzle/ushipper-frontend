import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { Button } from '../button';
import { Link } from '../link';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';

const t = translateByNamespace('common:go-to-sign-in-button');

export const GoToSignInButton = () => (
    <Link href='/client/sign-in' as='/sign-in'>
        <Button type='button' view='primary'>
            {t('go-to-sign-in-page')}
            <ArrowRightIcon style={{ marginLeft: '6px' }} />
        </Button>
    </Link>
);
