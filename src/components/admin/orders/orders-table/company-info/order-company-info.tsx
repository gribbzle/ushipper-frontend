import React, { useMemo } from 'react';

import { CompanyLogo } from '@/components/client/company/company-logo/company-logo';
import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { classname } from '@utils/classname';
import { getCompanyTypeTranslate } from '@utils/get-company-type-translate';
import { translateByNamespace } from '@utils/i18n';

import './order-company-info.scss';
import NoPhotoIcon from '@/assets/icons/no-photo-icon.svg';

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
