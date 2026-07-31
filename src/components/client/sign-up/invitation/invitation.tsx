import React from 'react';

import { CompanyBriefPaper } from '@/components/client/company/papers/company-brief-paper';
import { Link } from '@/components/common/link/link';
import { InvitationAction } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

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
