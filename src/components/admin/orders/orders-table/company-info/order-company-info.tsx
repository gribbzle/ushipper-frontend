import React, { useMemo } from 'react';

import { CompanyLogo } from '@/components/client';
import { useOrder, useOrderHelpers } from '@/hooks/order';
import { NoPhotoIcon } from '@icons';
import { classname, getCompanyTypeTranslate, translateByNamespace } from '@utils';

import './order-company-info.scss';

const cn = classname('order-company-info');
const t = translateByNamespace('admin:accounting:carriers:table');

export const OrderCompanyInfo = () => {
    const {
        company: { logo, name, type, isPartner },
    } = useOrder();

    const { isShipperOrderType } = useOrderHelpers();

    const typeText = useMemo(() => {
        if (isShipperOrderType) {
            return getCompanyTypeTranslate(type);
        }

        return t(isPartner ? 'ushipper-partner' : 'regular');
    }, [isShipperOrderType, type, isPartner]);

    return (
        <div className={cn()}>
            {isShipperOrderType && <>{logo?.url ? <CompanyLogo logoUrl={logo?.url} /> : <NoPhotoIcon />}</>}
            <div className={cn('details')}>
                <h4 className={cn('name')}>{name}</h4>
                <p className={cn('type')}>{typeText}</p>
            </div>
        </div>
    );
};
