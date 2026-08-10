import React from 'react';

import { useShowCompanyPage } from '@/hooks/use-show-company-page';
import { CheckGearIcon } from '@icons';
import { classname } from '@utils/classname';

import './company-name-block.scss';

const cn = classname('company-name');

export const CompanyNameInfoBlock = ({ name, companyPublicId }: { name: string; companyPublicId: string }) => {
    const { handleShowCompanyPage } = useShowCompanyPage();

    return (
        <div className={cn()}>
            <span
                className={cn('value')}
                onClick={event => {
                    event.stopPropagation();
                    handleShowCompanyPage(companyPublicId);
                }}
            >
                {name}
            </span>
            <CheckGearIcon />
        </div>
    );
};
