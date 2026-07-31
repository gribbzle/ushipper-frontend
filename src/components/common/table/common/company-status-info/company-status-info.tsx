import React from 'react';

import { StatusBlock } from '@/components/common/status-block/status-block';
import { StatusBlockView } from '@/components/common/status-block/status-block';
import { CompanyStatusEnum } from '@/enums';
import { getCompanyStatusTranslate } from '@utils/get-company-status-translate';

const statusViewMap = {
    [CompanyStatusEnum.BLOCKED]: 'danger',
    [CompanyStatusEnum.ACTIVE]: 'success',
    [CompanyStatusEnum.PENDING_CONFIRMATION]: 'warning',
};

export const CompanyStatusInfo = ({ companyStatus }: { companyStatus: CompanyStatusEnum }) => {
    const view = statusViewMap[companyStatus];

    return <StatusBlock view={view as StatusBlockView}>{getCompanyStatusTranslate(companyStatus)}</StatusBlock>;
};
