import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { CompanyRatingWithReviewCount } from '@/components/common';
import { OctothorpeIcon, PhoneIcon } from '@icons';
import { Load } from '@store/client';
import { classname, formatPhoneNumber, getObjectWithoutEmptyFields, translateByNamespace } from '@utils';

import './load-board-order-broker-column.scss';

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
