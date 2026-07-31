import React from 'react';
import { Field } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Link } from '@/components/common/link/link';
import { FormControl, InputLabel, TextField } from '@fields';
import { useAppSelector } from '@store';
import { usdotVerifyFormSubmitErrorCodeSelector, usdotVerifyFormSubmitErrorDataSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestErrorCode } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';
import { composeValidators, required, usDotValidator } from '@validators';

const t = (key: string) => translateByNamespace('client:sign-up-page')(`form.usdot-verification-step.${key}`);
const cn = classname('sign-up-page');

export const UsdotVerification = () => {
    const usdotVerifyFormSubmitErrorCode = useAppSelector(usdotVerifyFormSubmitErrorCodeSelector);
    const usdotVerifyFormSubmitErrorData = useAppSelector(usdotVerifyFormSubmitErrorDataSelector);

    return (
        <div className={cn('form-step')}>
            <h4>{t('title')}</h4>
            <p>
                {t('description')} <Link href='/'>{t('help-page')}</Link>.
            </p>
            <FormControl>
                <InputLabel>{t('usdot-label')}</InputLabel>
                <Field
                    name='usdotNumber'
                    component={TextField}
                    placeholder={t('usdot-placeholder')}
                    validate={composeValidators(required, usDotValidator())}
                    max={3}
                    help={
                        <p>
                            {t('usdot-help')} <Link href='/'>{t('help-page')}</Link>
                        </p>
                    }
                />
            </FormControl>
            {usdotVerifyFormSubmitErrorCode === RequestErrorCode.NOT_FOUND && <AlertBlock view='warning'>{t('usdot-not-found')}</AlertBlock>}
            {usdotVerifyFormSubmitErrorCode === RequestErrorCode.UNPROCESSABLE_ENTITY && usdotVerifyFormSubmitErrorData && (
                <AlertBlock view='warning'>
                    {renderTextWithBreakLines(t('usdot-exists'))}
                    {usdotVerifyFormSubmitErrorData && (
                        <>
                            <p>{usdotVerifyFormSubmitErrorData.name}</p>
                            <p>{usdotVerifyFormSubmitErrorData.city}</p>
                            <p>{usdotVerifyFormSubmitErrorData.phone}</p>
                        </>
                    )}
                </AlertBlock>
            )}
            {usdotVerifyFormSubmitErrorCode === RequestErrorCode.INTERNAL_SERVER_ERROR && (
                <AlertBlock view='danger'>{renderTextWithBreakLines(t('server-error'))}</AlertBlock>
            )}
            {usdotVerifyFormSubmitErrorCode === RequestErrorCode.GATEWAY_TIMEOUT && (
                <AlertBlock view='danger'>{renderTextWithBreakLines(t('gateway-timeout'))}</AlertBlock>
            )}
        </div>
    );
};
