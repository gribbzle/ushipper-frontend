import React from 'react';

import { RowItem } from '@/components/common/table/common/row-item/row-item';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getGallonsTranslate } from '@utils/translate/get-units-of-measurement-translate';

import './fuel-card-limits.scss';

const cn = classname('fuel-card-limits');
const t = translateByNamespace('admin:fuel:cards-page:limits');

type RenderLimitProps = {
    label: string;
    limit?: number | null;
    gallons?: string | null;
};

const renderLimit = ({ label, limit, gallons }: RenderLimitProps) => {
    const formattedValue = limit ? formatToCurrency(limit) : '—';
    const displayValue = gallons ? `${formattedValue} (${gallons})` : formattedValue;

    return <RowItem label={label} value={displayValue} />;
};

type FuelCardLimitsProps = {
    limit?: number | null;
    limitDef?: number | null;
    limitDefGal?: number | null;
    limitUlsdGal?: number | null;
};

export const FuelCardLimits = ({ limit, limitDef, limitDefGal, limitUlsdGal }: FuelCardLimitsProps) => (
    <div className={cn()}>
        {renderLimit({
            label: t('ulsd-limit'),
            limit,
            gallons: limitUlsdGal ? getGallonsTranslate(limitUlsdGal.toFixed(2)) : null,
        })}
        {renderLimit({
            label: t('def-limit'),
            limit: limitDef,
            gallons: limitDefGal ? getGallonsTranslate(limitDefGal.toFixed(2)) : null,
        })}
    </div>
);
