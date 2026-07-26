import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { CompanyType } from '@/enums';
import { Link } from '@components';
import { RadioPanelInput } from '@fields';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';
import { required } from '@validators';

const t = translateByNamespace('client:sign-up-page');
const cn = classname('sign-up-page');

type Props = {
    onInputChange: (value: CompanyType) => void;
};

export const AccountType = ({ onInputChange }: Props) => {
    const options = useMemo(
        () =>
            Object.values(CompanyType).map(type => {
                return {
                    value: type,
                    label: (
                        <div className={cn('company-type')}>
                            <h4>{t(`form.company-type-step.company-type-options.${type}.title`)}</h4>
                            <p>{renderTextWithBreakLines(t(`form.company-type-step.company-type-options.${type}.description`))}</p>
                        </div>
                    ),
                };
            }),
        [],
    );

    return (
        <div className={cn('form-step')}>
            <h4>{t('form.company-type-step.title')}</h4>
            <p>
                {t('form.company-type-step.description')} <Link href='/'>{t('form.company-type-step.help-page')}</Link>.
            </p>
            <Field name='companyType' component={RadioPanelInput} validate={required} required={true} options={options} onInputChange={onInputChange} />
        </div>
    );
};
