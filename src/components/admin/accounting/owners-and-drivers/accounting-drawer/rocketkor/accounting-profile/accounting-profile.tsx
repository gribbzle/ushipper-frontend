import React, { useMemo } from 'react';

import { AccountingInfoRow } from '@/components/admin/accounting/common/accounting-info-row/accounting-info-row';
import { File } from '@/components/client/job-offers/attachments-info-column/attachments-info-column';
import { Button } from '@/components/common/button/button';
import { useDriversActionsPermission } from '@/hooks/accounting/use-drivers-actions-permission';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountingItem } from '../../common';

import { AccountingProfileProps } from './accounting-profile.types';
import { useAccountingProfile } from './use-accounting-profile';

import './accounting-profile.scss';
import PencilWithLineIcon from '@/assets/icons/pencil-with-line.svg';

const cn = classname('accounting-profile');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const AccountingProfile = ({ handleEdit }: AccountingProfileProps) => {
    const {
        account,
        documents,
        taxIdCountry,
        mailingAddress,
        legalEntityType,
        accountingProfile,
        physicalAddressInfo,
        mailingAddressInfo,
        downloadAttachment,
    } = useAccountingProfile();
    const hasDriversActionsPermission = useDriversActionsPermission();

    const body = useMemo(
        () => (
            <>
                <div className={cn('key')}>{accountingProfile.legalName}</div>
                <AccountingInfoRow title={t('primary-phone-number')} value={accountingProfile.phone} />
                <AccountingInfoRow title={t('email')} value={account?.email ?? '—'} />
                <AccountingInfoRow title={t('business-tax-id')} value={accountingProfile?.taxId ?? '—'} />
                <AccountingInfoRow title={t('business-tax-id-country')} value={taxIdCountry?.title ?? '—'} />
                <AccountingInfoRow title={t('type-of-business')} value={legalEntityType?.label ?? '—'} />
                <AccountingInfoRow title={t('physical-address')} value={Object.values(physicalAddressInfo).join(', ')} />
                {mailingAddress.addressLine1 && <AccountingInfoRow title={t('mailing-address')} value={Object.values(mailingAddressInfo).join(', ')} />}

                {documents && (
                    <div className={cn('files')}>
                        {documents.map(document => (
                            <File
                                key={document.attachment.publicId}
                                size={document.attachment.size}
                                name={document.attachment.name}
                                onItemClickCallback={() => downloadAttachment(document.attachment)}
                            />
                        ))}
                    </div>
                )}
            </>
        ),
        [
            account?.email,
            accountingProfile.legalName,
            accountingProfile.phone,
            accountingProfile?.taxId,
            documents,
            downloadAttachment,
            legalEntityType?.label,
            mailingAddress.addressLine1,
            mailingAddressInfo,
            physicalAddressInfo,
            taxIdCountry?.title,
        ],
    );

    const actions = useMemo(
        () => (
            <Button onClick={handleEdit} view='default' size='mini'>
                <PencilWithLineIcon /> {t('edit')}
            </Button>
        ),
        [handleEdit],
    );

    return <AccountingItem body={body} header={accountingProfile.businessName} footer={hasDriversActionsPermission ? actions : null} />;
};
