import React from 'react';
import has from 'has-values';

import { RequestOrderInfo } from '@/components/client/requests/requests-drawer/request-order-info';
import { Button, RequestItem } from '@components';
import { ArrowDownIcon } from '@icons';
import { OrderRequest } from '@store/api/order-requests-api';
import { Load } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './requests-drawer.scss';

const cn = classname('requests-drawer');

type Props = {
    order?: Load;
    requests?: OrderRequest[];
    onShowMoreClick?: () => void;
    cursor?: string | null;
};

const t = translateByNamespace('client:requests-page:drawer');

export default function DrawerBody({ order, requests, cursor, onShowMoreClick }: Props) {
    if (!order || !requests) {
        return null;
    }

    return (
        <>
            <RequestOrderInfo order={order} />
            {has(requests) && (
                <div className={cn('request-list')}>
                    {requests.map(request => (
                        <RequestItem key={request.publicId} request={request} order={order} />
                    ))}
                    {cursor && (
                        <Button view='link' active={true} size='mini' onClick={onShowMoreClick}>
                            <ArrowDownIcon /> {t('show-more-button-label')}
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
