import React, { useMemo } from 'react';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import has from 'has-values';

import { ContactInfo } from '@/components/common/contact-info/contact-info';
import { BusinessTypesEnum } from '@/enums';
import { BriefcaseIcon, GeoLocationIcon, NotesIcon, ScheduleIcon } from '@icons';
import { OrderInformation } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { getBusinessTypeTranslate } from '@utils/translate/get-business-type-translate';

import { ItemField, NameField, ScheduledAtField } from './fields';

import './order-information-list.scss';

const cn = classname('order-information-list');
const t = translateByNamespace('client:order');

type OrderInformationListProps = {
    title?: string;
    emptyNameLabel?: string;
    fields: OrderInformation;
    pickedUpAt?: string | null;
    pickedUpAtTimezone?: string | null;
    deliveredAt?: string | null;
    deliveredAtTimezone?: string | null;
    externalCompanyMcNumber?: string | null;
    onClick: () => void;
};

export const OrderInformationList = ({
    title,
    emptyNameLabel,
    fields,
    pickedUpAt,
    pickedUpAtTimezone,
    deliveredAt,
    deliveredAtTimezone,
    externalCompanyMcNumber,
    onClick,
}: OrderInformationListProps) => {
    const address = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                streetAddress: fields.streetAddress,
                city: fields.city,
                state: fields.state,
                zip: fields.zip,
            }),
        [fields.city, fields.state, fields.streetAddress, fields.zip],
    );

    const mcNumber = useMemo((): string | null => {
        if ('mcNumber' in fields && fields.mcNumber) {
            return fields.mcNumber;
        }

        if (externalCompanyMcNumber) {
            return externalCompanyMcNumber;
        }

        return null;
    }, [externalCompanyMcNumber, fields]);

    return (
        <div className={cn('wrapper')}>
            {title && <div className={cn('title')}>{title}</div>}
            <div className={cn()}>
                {'businessName' in fields && <NameField onClick={onClick} emptyLabel={emptyNameLabel} title={fields.businessName} />}
                {'customerName' in fields && <NameField onClick={onClick} emptyLabel={emptyNameLabel} title={fields.customerName} />}
                {'businessType' in fields && fields.businessType && (
                    <ItemField value={getBusinessTypeTranslate(fields.businessType as BusinessTypesEnum)} icon={<BriefcaseIcon />} />
                )}
                {has(address) && <ItemField value={Object.values(address).join(', ')} icon={<GeoLocationIcon />} />}
                {mcNumber && <ItemField value={t('mc-number', { mcNumber })} icon='#' />}
                {'scheduledPickupAt' in fields && fields.scheduledPickupAt && (
                    <ScheduledAtField scheduledAt={fields.scheduledPickupAt} dateType={fields.pickupDateType} />
                )}
                {pickedUpAt && (
                    <ItemField
                        value={t('picked-up-on', {
                            date: formatInTimeZone(new Date(pickedUpAt), pickedUpAtTimezone || 'America/Los_Angeles', 'MMMM d, yyyy'),
                            time: formatInTimeZone(new Date(pickedUpAt), pickedUpAtTimezone || 'America/Los_Angeles', 'hh:mm a (zzz)', { locale: enUS }),
                        })}
                        icon={<ScheduleIcon />}
                    />
                )}
                {'scheduledDeliveryAt' in fields && fields.scheduledDeliveryAt && (
                    <ScheduledAtField scheduledAt={fields.scheduledDeliveryAt} dateType={fields.deliveryDateType} />
                )}
                {deliveredAt && (
                    <ItemField
                        value={t('delivered-on', {
                            date: formatInTimeZone(new Date(deliveredAt), deliveredAtTimezone || 'America/Los_Angeles', 'MMMM d, yyyy'),
                            time: formatInTimeZone(new Date(deliveredAt), deliveredAtTimezone || 'America/Los_Angeles', 'hh:mm a (zzz)', { locale: enUS }),
                        })}
                        icon={<ScheduleIcon />}
                    />
                )}
                {'buyerNumber' in fields && fields.buyerNumber && <ItemField value={t('buyer-number', { buyerNumber: fields.buyerNumber })} icon='#' />}
                <ContactInfo information={fields} />
                {'notes' in fields && fields.notes && <ItemField value={fields.notes} icon={<NotesIcon />} />}
            </div>
        </div>
    );
};
