import React from 'react';

import { AlertBlock, Loader } from '@/components/common';
import { isNumber } from '@/shared';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getPercentTranslate } from '@utils/translate/get-units-of-measurement-translate';

import './global-fuel-cards-settings-block.scss';

type FuelRate = {
    label: string;
    rate?: number | null;
};

type GlobalFuelCardsSettingsBlockProps = {
    fuelRates: FuelRate[];
    isLoading: boolean;
};

const cn = classname('global-fuel-cards-settings-block');
const tNoDetails = translateByNamespace('common:translate-value');

export const GlobalFuelCardsSettingsBlock = ({ fuelRates, isLoading }: GlobalFuelCardsSettingsBlockProps) =>
    isLoading ? (
        <div className={cn('loader')}>
            <Loader />
        </div>
    ) : (
        <AlertBlock className={cn('')}>
            {fuelRates.map(({ label, rate }) => (
                <DotLeader key={label} label={label} value={isNumber(rate) ? getPercentTranslate(rate) : tNoDetails('empty-value')} />
            ))}
        </AlertBlock>
    );
