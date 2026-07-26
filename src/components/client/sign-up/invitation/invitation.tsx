import React from 'react';

import { CompanyBriefPaper } from '@/components/client';
import { Link } from '@components';
import { InvitationAction } from '@store/client';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';

type Props = {
    invitation: InvitationAction;
};

const t = translateByNamespace('client:sign-up-page');
const cn = classname('sign-up-page');

export const Invitation = ({ invitation }: Props) => {
    return (
        <div className={cn('form-step')}>
            <h4 className={cn('title')}>{renderTextWithBreakLines(t('form.invitation-step.title', { company: invitation.company.name }))}</h4>
            <p>
                {t('form.company-type-step.description')} <Link href='/'>{t('form.company-type-step.help-page')}</Link>.
            </p>
            <CompanyBriefPaper company={invitation.company} />
        </div>
    );
};
