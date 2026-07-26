import React, { useMemo } from 'react';

import { LoadBoardFilters } from '@store/api/loadboard-api';
import { ParsedOfferData, ParsedOrderData } from '@store/client/loadboard';
import { classname, translateByNamespace } from '@utils';

import { AssignDriverForm } from '../assign-driver-form';
import { CheckingContractAlert } from '../checking-contract-alert';
import { CheckingContractItem } from '../checking-contract-item';
import { CheckingOfferItem } from '../checking-offer-item';

import './full-checking-contract-offer-block.scss';

const t = translateByNamespace('client:loadboard:checking-contract-popup');
const cn = classname('full-checking-contract-offer-block');

type Props = {
    loadBoardFilters: LoadBoardFilters;
    orderId: string | null;
    parsedOrders: (ParsedOrderData | ParsedOfferData)[];
    reverse?: boolean;
};

const isParsedOfferData = (item: ParsedOrderData | ParsedOfferData): item is ParsedOfferData => 'guid' in item;

export const FullCheckingContractOfferBlock = ({ orderId, parsedOrders, loadBoardFilters, reverse = false }: Props) => {
    const isSDOfferData = useMemo(() => parsedOrders.some(isParsedOfferData), [parsedOrders]);

    return (
        <div className={cn('')}>
            <CheckingContractAlert orderId={orderId} success={reverse} isSDOrder={isSDOfferData} />
            <div className={cn('list', { reverse: reverse && !isSDOfferData, 'sd-content': isSDOfferData })}>
                {!reverse && <span className={cn('text')}>{t('list-title')}</span>}
                <div className={cn('list', [cn('list-scroll')])}>
                    {parsedOrders.map(item =>
                        isParsedOfferData(item) ? (
                            <CheckingOfferItem key={item.guid} parsedOrder={item} loadBoardFilters={loadBoardFilters} />
                        ) : (
                            <CheckingContractItem key={item.id} parsedOrder={item} loadBoardFilters={loadBoardFilters} />
                        ),
                    )}
                </div>
                <AssignDriverForm isFull={isSDOfferData} />
            </div>
        </div>
    );
};
