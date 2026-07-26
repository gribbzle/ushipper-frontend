import React from 'react';

import { Accordion } from '@/components/common';
import { DamageCode } from '@/enums';
import { classname, translateByNamespace } from '@utils';

import './order-bol-damage-code.scss';

const cn = classname('order-bol-damage-code');
const damageCodeTranslate = translateByNamespace('common:damage-code');
const t = translateByNamespace('client:order-BOL-page:damage');

export const OrderBolDamageCode = () => (
    <Accordion title={t('header')} opened={true} className={cn()}>
        <div className={cn('content')}>
            {Object.values(DamageCode).map(definition => (
                <span key={definition} className={cn('definition')}>
                    {damageCodeTranslate(definition)}
                </span>
            ))}
            <div className={cn('figures-container')}>
                <div className={cn('figure-container')}>
                    <div className={cn('circles')}>{t('cr')}</div>
                    <span>{t('circles-pickup-damages')}</span>
                </div>
                <div className={cn('figure-container')}>
                    <div className={cn('rounded-rectangles')}>{t('cr')}</div>
                    <span>{t('rounded-rectangles-delivery-damages')}</span>
                </div>
            </div>
        </div>
    </Accordion>
);
