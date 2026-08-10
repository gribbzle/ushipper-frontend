import React, { useCallback } from 'react';

import { CompanyType } from '@/enums/company-type';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';

import './companies-users-info.scss';

const cn = classname('companies-users-info');

export const CompaniesUsersInfo = ({ info, isClickable = false }: { info: AccountingAccountUserData[]; isClickable?: boolean }) => {
    const handleCompanyClick = useCallback(
        async ({ name, type }: { name: string; type: CompanyType }) => window.open(`carriers?type=${type}&name=${encodeURIComponent(name)}`, '_blank'),
        [],
    );

    return (
        <div className={cn('', { hover: isClickable })}>
            {info.map(({ company }) => (
                <span
                    key={company?.publicId}
                    className={cn('company-name')}
                    onClick={isClickable && company ? () => handleCompanyClick({ name: company.name, type: company.type }) : undefined}
                >
                    {company?.name}
                </span>
            ))}
        </div>
    );
};
