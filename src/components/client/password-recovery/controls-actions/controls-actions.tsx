import React from 'react';

import { Button, Link } from '@components';
import { classname, translateByNamespace } from '@utils';

import './controls-actions.scss';

type Props = {
    buttonLabel: string;
    isDisabledSubmitButton: boolean;
};

const t = translateByNamespace('client:password-reset-page');
const cn = classname('controls-actions');

export const ControlsActions = ({ buttonLabel, isDisabledSubmitButton }: Props) => (
    <div className={cn()}>
        <Button type='submit' view='primary' disabled={isDisabledSubmitButton}>
            {buttonLabel}
        </Button>
        <Link href='/client/sign-in' as='/sign-in'>
            {t('sign-in-link')}
        </Link>
    </div>
);
