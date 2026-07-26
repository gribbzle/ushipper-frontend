import React from 'react';

import { RegistrationType } from '@/enums';
import { AlertBlock, Link } from '@components';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';

const t = translateByNamespace('client:sign-up-page');
const cn = classname('sign-up-page');

type Props = {
    confirmationMethod?: RegistrationType;
    isInvite: boolean;
};

export const Completed = ({ confirmationMethod, isInvite }: Props) => {
    const messageKey =
        confirmationMethod === RegistrationType.MANUAL_CONFIRMATION ? 'form.completed-step.message-pending-approval' : 'form.completed-step.message';

    return (
        <div className={cn('form-step')}>
            <h4>{t('form.completed-step.title')}</h4>
            <p>
                {t('form.completed-step.description')} <Link href='/'>{t('form.completed-step.help-page')}</Link>.
            </p>
            {!isInvite && <AlertBlock>{renderTextWithBreakLines(t(messageKey))}</AlertBlock>}
        </div>
    );
};
