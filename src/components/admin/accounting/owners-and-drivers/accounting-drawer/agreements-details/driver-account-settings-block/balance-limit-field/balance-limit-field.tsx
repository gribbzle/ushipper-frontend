import React, { useMemo } from 'react';
import has from 'has-values';
import { useForm } from 'react-final-form';

import { AlertBlock } from '@/components/common';
import { CurrencyInput, FormControl, InputLabel, PrefixedField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { renderTextWithBreakLines } from '@utils/render';
import { requiredCurrency } from '@validators';

import { AgreementsDetailsFormState } from '../../agreements-details.types';

const cn = classname('agreements-details');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');

export const BalanceLimitField = ({ disabled }: { disabled: boolean }) => {
    const { getState } = useForm<AgreementsDetailsFormState>();
    const {
        driverSettings: { driverMinimalBalance },
    } = getState().values;

    const limit = useMemo(() => (has(driverMinimalBalance) ? formatToCurrency(Number(driverMinimalBalance)) : '...'), [driverMinimalBalance]);

    return (
        <>
            <FormControl className={cn('balance-limit')}>
                <InputLabel required={true}>{t('limit-amount-label')}</InputLabel>
                <PrefixedField
                    name='driverMinimalBalance'
                    parse={value => value}
                    component={CurrencyInput}
                    startAdornment='$'
                    placeholder=''
                    validate={requiredCurrency}
                    disabled={disabled}
                />
            </FormControl>
            <AlertBlock>{renderTextWithBreakLines(t('balance-limit-alert', { limit }))}</AlertBlock>
        </>
    );
};
