import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { AttachmentsDropzone } from '@/components/client/orders/forms/attachments-form/attachments-dropzone';
import { Button, Popup } from '@/components/common';
import { FileUploaderField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DocumentFormValue } from '../../document-form';

import { RocketkorDocumentPopupProps } from './rocketkor-document-popup.types';
import { useRocketkorDocumentPopup } from './use-rocketkor-document-popup';

import './rocketkor-document-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');
const tValidate = translateByNamespace('common:validators');
const cn = classname('rocketkor-document-popup');

export const validateFileUpload = ({ files }: DocumentFormValue) => {
    if (files?.length === 0) {
        return { files: tValidate('required') };
    }

    return undefined;
};

export const RocketkorDocumentPopup = ({ title, isOpened, formBody, handleSave, handleClose }: RocketkorDocumentPopupProps) => {
    const { formRef, initialValues, isLoading, handleSubmit, hasAttachmentsDropzone, setHasAttachmentsDropzone, handlePopupClose } =
        useRocketkorDocumentPopup(handleClose);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleSubmit} hasLoader={isLoading}>
                    {t('save')}
                </Button>
                <Button view='default' size='small' onClick={handlePopupClose}>
                    {t('cancel')}
                </Button>
            </>
        ),
        [handlePopupClose, handleSubmit, isLoading],
    );

    const form = useMemo(
        () => (
            <Form<DocumentFormValue>
                onSubmit={handleSave}
                validate={validateFileUpload}
                initialValues={initialValues}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit} className={cn('')}>
                            {formBody}
                            {hasAttachmentsDropzone ? (
                                <AttachmentsDropzone
                                    label={t('upload-file')}
                                    onDeleteFile={() => setHasAttachmentsDropzone(false)}
                                    files={initialValues?.attachment ? [initialValues.attachment] : []}
                                    isMultiFiles={false}
                                />
                            ) : (
                                <Field name='files' label={t('upload-file')} component={FileUploaderField} isMultiFiles={false} />
                            )}
                        </form>
                    );
                }}
            />
        ),
        [formBody, formRef, handleSave, hasAttachmentsDropzone, initialValues, setHasAttachmentsDropzone],
    );

    return <Popup size='large' description={form} onClose={handlePopupClose} isOpen={isOpened} actions={actions} title={title} />;
};
