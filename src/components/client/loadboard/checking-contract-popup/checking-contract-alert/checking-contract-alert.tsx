import React, { useMemo } from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './checking-contract-alert.scss';

const t = translateByNamespace('client:loadboard:checking-contract-popup');
const cn = classname('checking-contract-alert');

type Props = {
    orderId: string | null;
    success?: boolean;
    isSDOrder: boolean;
};

export const CheckingContractAlert = ({ orderId, success, isSDOrder }: Props) => {
    const text = useMemo(() => {
        const orderType = isSDOrder ? 'offer' : 'contract';
        const key = success ? `${orderType}-order-text-alert` : `no-find-${orderType}-text-alert`;

        return t(key);
    }, [success, isSDOrder]);

    return (
        <AlertBlock view={success ? 'success' : 'warning'}>
            <span className={cn('text')}>
                {text} <strong>{t('order-id', { orderId: orderId || t('none') })}</strong> {success && t('found-contract-text-alert')}
            </span>
            <br />
            <span className={cn('text')}>
                {success ? (
                    t(`alert-${isSDOrder ? 'offer' : 'contract'}-review-text`)
                ) : (
                    <>
                        <strong>{t('alert-reason-prefix')}</strong> {t('alert-data-change-suffix')}
                    </>
                )}
            </span>
        </AlertBlock>
    );
};
