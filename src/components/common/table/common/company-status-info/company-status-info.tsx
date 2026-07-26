import React from 'react';

import { StatusBlock, StatusBlockView } from '@/components/common';
import { CompanyStatusEnum } from '@/enums';
import { getCompanyStatusTranslate } from '@utils';

const statusViewMap = {
    [CompanyStatusEnum.BLOCKED]: 'danger',
    [CompanyStatusEnum.ACTIVE]: 'success',
    [CompanyStatusEnum.PENDING_CONFIRMATION]: 'warning',
};

export const CompanyStatusInfo = ({ companyStatus }: { companyStatus: CompanyStatusEnum }) => {
    const view = statusViewMap[companyStatus];

    return <StatusBlock view={view as StatusBlockView}>{getCompanyStatusTranslate(companyStatus)}</StatusBlock>;
};
