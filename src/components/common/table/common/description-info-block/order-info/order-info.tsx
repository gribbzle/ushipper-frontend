import React from 'react';

import { Link } from '@/components/common/link/link';
import { useMeAdmin } from '@hooks';
import { Transaction } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:balance-table');

type OrderInfoProps = Pick<Transaction, 'entity'>;

export const OrderInfo = ({ entity }: OrderInfoProps) => {
    const { orderId, publicId, type } = entity?.data || {};
    const isMeAdmin = useMeAdmin();

    if (!publicId) {
        return null;
    }

    return (
        <>
            {isMeAdmin && (
                <>
                    {t('for-order')}{' '}
                    <Link
                        href={{
                            pathname: `/admin/orders/${type}/[order-id]`,
                            query: { ['order-id']: publicId },
                        }}
                        as={`/admin/orders/${type}/${publicId}`}
                    >
                        {orderId ? ` #${orderId}` : t('no-order-id')}
                    </Link>
                </>
            )}
            {!isMeAdmin && (
                <>
                    {t('for-order')}: <strong>#{orderId ?? t('no-order-id')}</strong>
                </>
            )}
        </>
    );
};
