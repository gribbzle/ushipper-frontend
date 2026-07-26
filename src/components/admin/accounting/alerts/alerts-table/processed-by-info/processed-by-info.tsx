import React from 'react';

import { UserInfoBlock } from '@/components/common';
import { useIssue } from '@hooks';
import { useGetUserQuery } from '@store/api/users-api';
import { classname } from '@utils';

import './processed-by-info.scss';

const cn = classname('processed-by-info');

export const ProcessedByInfo = () => {
    const { processedBy } = useIssue();

    const { data: user } = useGetUserQuery({ id: processedBy?.id ?? '' }, { skip: !processedBy?.id });

    if (!processedBy) {
        return <>—</>;
    }

    return user ? <UserInfoBlock {...user} /> : <h4 className={cn('')}>{processedBy.name}</h4>;
};
