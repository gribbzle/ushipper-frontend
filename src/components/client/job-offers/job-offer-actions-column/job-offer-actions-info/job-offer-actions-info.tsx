import React from 'react';

import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { useShowCompanyPage } from '@hooks';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import { JobOfferActionsInfoProps } from './job-offer-actions-info.types';
import { useJobOfferActionsInfo } from './use-job-offer-actions-info';

import './job-offer-actions-info.scss';

const t = translateByNamespace('client:order-offers');
const cn = classname('job-offer-actions-info');

export const JobOfferActionsInfo = ({ info: { receiver, createdAt, creator, acceptedAt, status, declinedAt, type } }: JobOfferActionsInfoProps) => {
    const { isCarrier, isDispatcher } = useJobOfferActionsInfo();
    const { handleShowCompanyPage } = useShowCompanyPage();

    return (
        <div className={cn()}>
            {isDispatcher && creator && receiver && (
                <div className={cn('meta')}>
                    {type === 'company_to_user' ? t('item:sent-by') : t('item:sent')}{' '}
                    <strong onClick={() => handleShowCompanyPage(type === 'company_to_user' ? creator.company.publicId : receiver.company.publicId)}>
                        {type === 'company_to_user' ? creator.name : receiver.name}
                    </strong>{' '}
                    {diffForHumans(new Date(createdAt))}
                </div>
            )}
            {isCarrier && creator && receiver && (
                <div className={cn('meta')}>
                    {type === 'company_to_user' ? t('item:sent') : t('item:sent-by')}{' '}
                    <strong onClick={() => handleShowCompanyPage(type === 'company_to_user' ? receiver.company.publicId : creator.company.publicId)}>
                        {type === 'company_to_user' ? receiver.name : creator.name}
                    </strong>{' '}
                    {diffForHumans(new Date(createdAt))}
                </div>
            )}
            {status === OfferStatusesEnum.ACCEPTED && acceptedAt && (
                <div className={cn('meta')}>
                    {t('item:accepted')} {diffForHumans(new Date(acceptedAt))}
                </div>
            )}
            {status === OfferStatusesEnum.DECLINED && declinedAt && (
                <div className={cn('meta')}>
                    {t('item:declined')} {diffForHumans(new Date(declinedAt))}
                </div>
            )}
        </div>
    );
};
