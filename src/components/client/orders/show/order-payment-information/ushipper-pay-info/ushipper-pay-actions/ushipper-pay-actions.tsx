import React from 'react';

import { Button } from '@/components/common';
import { classname, translateByNamespace } from '@utils';

import { useUshipperPayActions } from './useUshipperPayActions';

import './ushipper-pay-actions.scss';

const t = translateByNamespace('client:order:payment-information:actions');

const cn = classname('ushipper-pay-actions');

export const UshipperPayActions = () => {
    const { recalculateTransactionsHandler, viewTransactionsHandler, showRegenerateTransactionBtn } = useUshipperPayActions();

    return (
        <div className={cn('')}>
            <Button size='mini' plain={true} onClick={viewTransactionsHandler}>
                {t('view-transactions')}
            </Button>
            {showRegenerateTransactionBtn && (
                <Button size='mini' plain={true} view='warning' onClick={recalculateTransactionsHandler}>
                    {t('regenerate-transactions')}
                </Button>
            )}
        </div>
    );
};
