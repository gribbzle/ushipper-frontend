import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { formatPhoneNumber } from '@utils/phone';

import './load-board-order-broker-column.scss';
import OctothorpeIcon from '@/assets/icons/octothorpe.svg';
import PhoneIcon from '@/assets/icons/phone.svg';

const cn = classname('load-board-order-broker-column');
const loadBoardTranslate = translateByNamespace('client:loadboard:item');

type Props = Pick<Load, 'company' | 'details'>;

export const LoadBoardOrderBrokerColumn = ({ company, details }: Props) => {
    const { phone, name, publicId, rating, reviewsTotal } = company;
    const { orderId } = details;

    const broker = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                name,
                phone,
                orderId,
            }),
        [name, orderId, phone],
    );

    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${publicId}`;

        window.open(aliasPath, '_blank');
    }, [publicId]);

    return (
        <div className={cn()}>
            {has(broker) && (
                <>
                    {'name' in broker && (
                        <>
                            <span className={cn('name')} onClick={handleShowCompanyPage}>
                                {broker.name}
                            </span>
                            <CompanyRatingWithReviewCount rating={rating} reviewsTotal={reviewsTotal} />
                        </>
                    )}
                    {'phone' in broker && broker.phone && (
                        <div className={cn('item')}>
                            <PhoneIcon />
                            <a href={`tel:${broker.phone}`}>{formatPhoneNumber(broker.phone)}</a>
                        </div>
                    )}
                    {'orderId' in broker && (
                        <div className={cn('item')}>
                            <OctothorpeIcon />
                            <span>{broker.orderId}</span>
                        </div>
                    )}
                </>
            )}
            {!has(broker) && <span>{loadBoardTranslate('no-broker')}</span>}
        </div>
    );
};
