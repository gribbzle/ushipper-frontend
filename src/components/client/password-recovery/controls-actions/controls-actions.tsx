import React from 'react';

import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
