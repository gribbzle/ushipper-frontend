import React, { useMemo } from 'react';

import { DispatcherLanguages } from '@/components/common/dispatcher-languages/dispatcher-languages';
import { InfoList } from '@/components/common/info-list/info-list';
import { InfoListBody } from '@/components/common/info-list/info-list-body/info-list-body';
import { Paper } from '@/components/common/paper/paper';
import { useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { useGetUserQuery } from '@store/api/users-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getTransportServiceTranslate } from '@utils/specialization';

import { DispatcherStats } from '../dispatcher-stats/dispatcher-stats';

import './dispatcher-info.scss';

const cn = classname('dispatcher-info');
const t = translateByNamespace('client:company-page');

export const DispatcherInfo = () => {
    const isDriverOwnerPage = useIsDriverOwnerPage();

    return <Paper title={isDriverOwnerPage ? t('driver-info') : t('dispatcher-info')} body={<DispatcherInfoBody />} />;
};

const DispatcherInfoBody = () => {
    const company = useAppSelector(fetchedCompanySelector);
    const isDriverOwnerPage = useIsDriverOwnerPage();

    const { data: user } = useGetUserQuery({ id: company?.owner.publicId }, { skip: !company });

    const formattedItems = useMemo(() => {
        return user?.specializations?.flatMap(specialization =>
            specialization.categories.map(category => `${getTransportServiceTranslate(specialization.name)} (${category.name})`),
        );
    }, [user?.specializations]);

    return (
        <>
            {user && (
                <div className={cn()}>
                    {user.description && <div className={cn('bio')}>{user.description}</div>}
                    {!!formattedItems?.length && (
                        <InfoList title={t('dispatcher-page.specialization')}>
                            <InfoListBody items={formattedItems} />
                        </InfoList>
                    )}
                    {!!user?.communicationLanguages?.length && (
                        <InfoList title={t('dispatcher-page.languages')}>
                            <DispatcherLanguages languages={user.communicationLanguages} />
                        </InfoList>
                    )}
                    {isDriverOwnerPage ? null : <DispatcherStats user={user} />}
                </div>
            )}
        </>
    );
};
