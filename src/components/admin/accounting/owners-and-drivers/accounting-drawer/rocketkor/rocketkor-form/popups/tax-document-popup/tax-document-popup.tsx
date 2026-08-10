import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { RocketkorDocumentPopup } from '../rocketkor-document-popup';

import { useTaxDocumentPopup } from './use-tax-document-popup';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const TaxDocumentPopup = () => {
    const { isOpened, handleSave, handleClose } = useTaxDocumentPopup();

    const formBody = useMemo(
        () => (
            <>
                <FormControl>
                    <InputLabel required={true}>{t('document-name')}</InputLabel>
                    <Field name='name' component={TextField} validate={required} />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('document-description')}</InputLabel>
                    <Field name='description' component={TextField} validate={required} multiline={true} />
                </FormControl>
            </>
        ),
        [],
    );

    return <RocketkorDocumentPopup title={t('add-tax')} isOpened={isOpened} handleClose={handleClose} handleSave={handleSave} formBody={formBody} />;
};
