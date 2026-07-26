import { useMemo } from 'react';

import { Transaction } from '@store/admin';
import { getPaymentConfirmationTypeTranslate, isCashIn, isCashOut, translateByNamespace } from '@utils';

const tCash = translateByNamespace('admin:accounting:filters');

export type usePaymentConfirmationTextProps = Pick<Transaction, 'type' | 'destinationBalance' | 'sourceBalance'>;

export const usePaymentConfirmationText = ({ type: confirmation, destinationBalance, sourceBalance }: usePaymentConfirmationTextProps) => {
    const isCashOutOperation = useMemo(() => isCashOut({ confirmation, destinationType: destinationBalance?.type }), [confirmation, destinationBalance?.type]);
    const isCashInOperation = useMemo(() => isCashIn({ confirmation, sourceType: sourceBalance?.type }), [confirmation, sourceBalance?.type]);

    return useMemo(() => {
        if (isCashOutOperation) {
            return tCash('cash-out');
        }

        if (isCashInOperation) {
            return tCash('cash-in');
        }

        return getPaymentConfirmationTypeTranslate(confirmation);
    }, [confirmation, isCashOutOperation, isCashInOperation]);
};
