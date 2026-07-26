import React from 'react';

import { Link } from '@/components/common';
import { classname, translateByNamespace } from '@utils';

import './company-name-is-partner-info.scss';

const cn = classname('company-name-is-partner-info');
const t = translateByNamespace('admin:accounting:carriers:table');

export const CompanyNameIsPartnerInfo = ({ trimCompanyName, name, isPartner }: { name: string; isPartner: boolean; trimCompanyName?: boolean }) => (
    <div className={cn()}>
        <Link
            onClick={e => e.stopPropagation()}
            href={{
                pathname: '/admin/accounting/carriers',
                query: { name },
            }}
            as={`/admin/accounting/carriers?name=${encodeURIComponent(name)}`}
            className={cn('name', { trimmed: trimCompanyName })}
        >
            {name}
        </Link>
        <span className={cn('details')}>{t(`${isPartner ? 'ushipper-partner' : 'regular'}`)}</span>
    </div>
);
