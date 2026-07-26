import React from 'react';

import { AssignItem } from '@components';
import { Company } from '@store/admin';
import { classname, translateByNamespace } from '@utils';

import './order-carrier-company-assign-item.scss';
const t = translateByNamespace('client:orders-page:send-offer-to-carrier:drawer');
const cn = classname('carrier-company-assign-item');

type Props = {
    onClick: () => void;
    disabled: boolean;
    company: Company;
    buttonLabel?: string;
};
export const OrderCarrierCompanyAssignItem = ({ onClick, disabled, company, buttonLabel }: Props) => {
    return (
        <AssignItem onClick={onClick} disabled={disabled} buttonLabel={buttonLabel}>
            <div className={cn()}>
                <div className={cn('header')}>{company.name}</div>
                <div className={cn('label-text')}>
                    <span className={cn('label-sub-text')}>{t('usdot')}:</span> {company.usdotNumber}
                </div>
                <div className={cn('label-text')}>
                    <span className={cn('label-sub-text')}>{t('company-email')}:</span> {company.email}
                </div>
                <div className={cn('label-text')}>
                    <span className={cn('label-sub-text')}>{t('company-phone')}:</span> {company.phone}
                </div>
            </div>
        </AssignItem>
    );
};
