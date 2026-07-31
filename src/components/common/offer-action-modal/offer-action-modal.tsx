import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OfferActionModalProps } from './offer-action-modal.types';

import './offer-action-modal.scss';

const t = translateByNamespace('client:order-offers:action-modal');
const cn = classname('offer-action-modal');

export const OfferActionModal = ({ onClose, children, isOpen, onAction, title = t('decline-description'), type }: OfferActionModalProps) => {
    const description = useMemo(
        () => (
            <div className={cn('description')}>
                <p className={cn('title')}>{title}</p>
                {children}
            </div>
        ),
        [children, title],
    );

    const actions = useMemo(
        () => (
            <div className={cn('action-btns')}>
                <Button size='small' onClick={onClose}>
                    {t('cancel')}
                </Button>
                {type === 'accept' ? (
                    <Button view='primary' size='small' onClick={onAction}>
                        {t('accept-btn')}
                    </Button>
                ) : (
                    <Button view='danger' size='small' onClick={onAction}>
                        {t('decline-btn')}
                    </Button>
                )}
            </div>
        ),
        [onClose, onAction, type],
    );

    return (
        <Popup
            isOpen={isOpen}
            className={cn()}
            onClose={onClose}
            title={type === 'accept' ? t('accept-title') : t('decline-title')}
            description={description}
            actions={actions}
        />
    );
};
