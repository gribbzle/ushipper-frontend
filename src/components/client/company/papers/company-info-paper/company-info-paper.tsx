import React, { useMemo } from 'react';
import has from 'has-values';

import { LabeledText } from '@/components/common/labeled-text/labeled-text';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { DotLeader } from '@ui';
import { extractStreetAndNumber, formatAddress } from '@utils/address';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import './company-info-paper.scss';

const t = translateByNamespace('client:company-page:company-info');
const translateCompanyTypes = translateByNamespace('common:company-types');
const cn = classname('company-info');

export const CompanyInfo = () => {
    const company = useAppSelector(fetchedCompanySelector);

    const address = useMemo(() => {
        return company
            ? getObjectWithoutEmptyFields({
                  address: extractStreetAndNumber(company.address),
                  city: company.city,
                  state: company.state,
                  zip: company.zip,
              })
            : null;
    }, [company]);

    const body = useMemo(
        () => (
            <>
                {company && (
                    <>
                        <>
                            <DotLeader label={t('fields.business-type')} value={translateCompanyTypes(company.type)} />
                            <DotLeader label={t('fields.USDOT')} value={company.usdotNumber ? company.usdotNumber : t('empty-value')} />
                            <DotLeader label={t('fields.mc-number')} value={company.mcNumber ? company.mcNumber : t('empty-value')} />
                            <DotLeader label={t('fields.address')} value={address && has(address) ? formatAddress(address) : t('empty-value')} />
                            <DotLeader isLink={!!company.website} label={t('fields.website')} value={company.website ? company.website : t('empty-value')} />
                            <DotLeader label={t('fields.trailers')} value={company.trailers ? company.trailers : t('empty-value')} />
                            <DotLeader label={t('fields.drivers')} value={company.drivers ? company.drivers : t('empty-value')} />
                        </>
                        {company.description && <LabeledText label={t('fields.description')} value={company.description} />}
                    </>
                )}
            </>
        ),
        [company, address],
    );

    return <Paper className={cn()} title={t('header')} body={body} />;
};
