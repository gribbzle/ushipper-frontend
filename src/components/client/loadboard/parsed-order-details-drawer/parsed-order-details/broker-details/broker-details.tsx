import React, { useMemo } from 'react';
import has from 'has-values';

import { Paper } from '@/components/ui/surfaces/paper/paper';
import { getOrderCustomerAddress } from '@/utils/order';
import { ClockIcon, EmailIcon, ExternalLinkIcon, GeoLocationIcon, PersonIcon, PhoneIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ExternalBrokerRating, HiddenExternalBrokerTooltip } from '../../../common';
import { DetailItem } from '../../detail-item';
import { ExternalCompanyContactInfo } from '../../external-company-contact';

import { BrokerDetailsProps } from './broker-details.types';
import { BrokerDetailsHeader } from './broker-details-header';
import { NoData } from './no-data';
import { ViewFMCSAButton } from './view-fmcsa-button';

import './broker-details.scss';

const cn = classname('broker-details');
const tNoData = translateByNamespace('common:order');
const t = translateByNamespace('client:loadboard:load-details');

export const BrokerDetails = ({ order, loadBoardFilters }: BrokerDetailsProps) => {
    const { customerInformation, source, externalShipper } = order;
    const { customerName, externalCompany, businessType, email, phone } = customerInformation;
    const { workingHours, mcNumber, phone: externalPhone, companyInformation, contactInformation, type } = externalCompany || {};

    const { webSite, companyDescription, ownerManager, establishedIn } = companyInformation || {};

    const { contact } = contactInformation || {};
    const phoneNumber = externalPhone || phone;

    const brokerAddress = useMemo(() => customerInformation && getOrderCustomerAddress(customerInformation), [customerInformation]);

    if (!customerInformation) {
        return <NoData />;
    }

    return (
        <Paper
            className={cn('')}
            header={<BrokerDetailsHeader loadBoardFilters={loadBoardFilters} order={order} />}
            body={
                <div className={cn('body')}>
                    {customerName ? <span className={cn('broker-name')}>{customerName}</span> : <HiddenExternalBrokerTooltip />}
                    <ExternalBrokerRating orderSource={source} externalShipper={externalShipper} externalCompany={externalCompany} />
                    <div className={cn('info')}>
                        <DetailItem label={t('business-type')} value={type ?? businessType} valueClassName={cn('strong')} />

                        <DetailItem
                            label={t('mc-number')}
                            value={mcNumber}
                            valueClassName={cn('strong')}
                            actions={mcNumber && <ViewFMCSAButton mcNumber={mcNumber} />}
                        />
                        <DetailItem Icon={PhoneIcon} value={phoneNumber ? <a href={`tel:${phoneNumber}`}>{phoneNumber}</a> : tNoData('no-data')}></DetailItem>
                        <DetailItem Icon={EmailIcon} value={email && has(email) ? <a href={`mailto:${email}`}>{email}</a> : tNoData('no-data')}></DetailItem>
                        <DetailItem value={workingHours} Icon={ClockIcon} />
                        <DetailItem value={brokerAddress} Icon={GeoLocationIcon} />
                        <DetailItem value={webSite} Icon={ExternalLinkIcon} />
                        {companyDescription && <DetailItem value={companyDescription} valueClassName={cn('description')} />}
                        <DetailItem label={t('owner-manager')} value={ownerManager} />
                        <DetailItem label={t('established-in')} value={establishedIn} />
                        <DetailItem value={contact} Icon={PersonIcon} />
                        <ExternalCompanyContactInfo contactInformation={contactInformation} />
                    </div>
                </div>
            }
        />
    );
};
