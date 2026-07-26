import React, { useMemo } from 'react';

import { OrderSourcesEnum } from '@/enums';
import { OrderTag, PaymentInfo } from '@components';
import { useMeDriverRelated } from '@hooks';
import { ImportIcon, SuperDispatchImportIcon } from '@icons';
import { Load } from '@store/client';
import { classname, diffForHumans } from '@utils';

import { getOrderSource } from './utils';

import './parsed-loadboard-item-payment-block.scss';

const cn = classname('parsed-loadboard-item-payment-block');

export const ParsedLoadboardItemPaymentBlock = ({ order, tagged }: { order: Load; tagged: boolean }) => {
    const { source, postedAt } = order;
    const isSuperDispatchSource = order.source === OrderSourcesEnum.SUPER_DISPATCH_PARSED;
    const postedDate = useMemo(() => diffForHumans(new Date(postedAt), true), [postedAt]);
    const isDriver = useMeDriverRelated();

    const showImportIcon = useMemo(() => !isDriver, [isDriver]);

    return (
        <div className={cn('')}>
            <PaymentInfo order={order} inline={true} />
            <div className={cn('source', { danger: isSuperDispatchSource })}>
                {showImportIcon && source && (
                    <OrderTag view={isSuperDispatchSource ? 'source-danger' : 'source'} size='medium'>
                        {isSuperDispatchSource ? <SuperDispatchImportIcon /> : <ImportIcon />} {getOrderSource(source)}
                    </OrderTag>
                )}
                <span className={cn(`${tagged ? 'label' : 'meta'}`)}>{postedDate}</span>
            </div>
        </div>
    );
};
