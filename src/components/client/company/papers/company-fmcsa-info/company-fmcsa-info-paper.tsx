import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Paper } from '@/components/common/paper/paper';
import { useGetCompanyFMCSARecordQuery } from '@store/api/company-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { FMCSAFullInfoBlock } from './fmcsa-full-info-block';

import './company-fmcsa-info-paper.scss';

const t = translateByNamespace('client:company-page:fmcsa-info');
const translateEmptyTitle = translateByNamespace('client:company-page');
const cn = classname('fmcsa-info-paper');

const EmptyBlock = () => <div className={cn('empty-block')}>{translateEmptyTitle('empty-value')}</div>;

export const CompanyFMCSAInfo = () => {
    const router = useRouter();
    const companyId = router.query['company-id'] as string;

    const { data: FMCSAInfo } = useGetCompanyFMCSARecordQuery({ companyId }, { skip: !companyId });

    const body = useMemo(() => (FMCSAInfo ? <FMCSAFullInfoBlock info={FMCSAInfo} companyId={companyId} /> : <EmptyBlock />), [FMCSAInfo, companyId]);

    return <Paper className={cn()} title={t('header')} body={body} />;
};
