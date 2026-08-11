import React, { MutableRefObject, useCallback, useMemo } from 'react';
import { FormApi } from 'final-form';
import arrayMutators from 'final-form-arrays';
import has from 'has-values';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { RequestError } from '@/shared/types';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { CreateRequestedDocumentPayload, useCreateRequestedDocumentsMutation, usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './mark-as-documents-requested-form.scss';
import PlusIcon from '@/assets/icons/plus.svg';
import TrashIcon from '@/assets/icons/trash-can.svg';

export type DocumentsRequestedFormState = {
    documentsRequested: CreateRequestedDocumentPayload[];
};

type MarkAsDocumentsRequestedFormProps = {
    orderPublicId: string | null;
    formRef: MutableRefObject<FormApi<DocumentsRequestedFormState> | undefined>;
    onAfterSubmit: () => void;
};

const FIELD_ARRAY_NAME = 'documentsRequested';

const t = translateByNamespace('admin:orders-page:mark-as-documents-requested-popup:form');
const tNot = translateByNamespace('admin:orders-page:notifications');
const cn = classname('mark-as-documents-requested-form');

export const MarkAsDocumentsRequestedForm = ({ orderPublicId, formRef, onAfterSubmit }: MarkAsDocumentsRequestedFormProps) => {
    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const [createDocumentsRequested] = useCreateRequestedDocumentsMutation();

    const onSubmit = useCallback(
        async ({ documentsRequested }: DocumentsRequestedFormState) => {
            if (!orderPublicId) {
                return;
            }

            const cleaned = documentsRequested.filter(item => !!item?.title);

            try {
                if (has(cleaned)) {
                    await Promise.all(
                        cleaned.map(data =>
                            createDocumentsRequested({
                                orderPublicId,
                                data,
                            }).unwrap(),
                        ),
                    );

                    toast.success<string>(t('add-documents-requested-success-notification'));
                }

                await partiallyUpdateOrder({
                    publicOrderId: orderPublicId,
                    newOrderData: { fundsTransferStatus: FundsTransferStatus.DOCUMENTS_REQUESTED },
                }).unwrap();

                toast.success<string>(t('mark-as-documents-requested-success-notification'));

                onAfterSubmit();
            } catch (error) {
                parseAndShowAxiosError(error as RequestError, tNot<string>('update-error-notification'));
            }
        },
        [orderPublicId, partiallyUpdateOrder, onAfterSubmit, createDocumentsRequested],
    );

    const handleDocumentRequestedAddClick = useCallback(() => formRef.current?.mutators.push(FIELD_ARRAY_NAME), [formRef]);

    const handleDocumentRequestedDeleteClick = useCallback(
        (index: number) => {
            formRef.current?.mutators.remove(FIELD_ARRAY_NAME, index);
        },
        [formRef],
    );

    const initialValues = useMemo<DocumentsRequestedFormState>(
        () => ({
            [FIELD_ARRAY_NAME]: [{ title: '' }],
        }),
        [],
    );

    return (
        <Form<DocumentsRequestedFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            mutators={{
                ...arrayMutators,
            }}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn('')}>
                        <p className={cn('title')}>{t('title')}</p>

                        <FieldArray name={FIELD_ARRAY_NAME}>
                            {({ fields }) =>
                                fields.map((name, index) => (
                                    <FormControl key={index}>
                                        <InputLabel>{t('title-field-label', { index: index + 1 })}</InputLabel>
                                        <div className={cn('row')}>
                                            <Field name={`${name}.title`} component={TextField} placeholder='' />
                                            <IconButton Icon={TrashIcon} onClick={() => handleDocumentRequestedDeleteClick(index)} />
                                        </div>
                                    </FormControl>
                                ))
                            }
                        </FieldArray>
                        <Button view='link' size='mini' active={true} onClick={handleDocumentRequestedAddClick} className={cn('add-btn')}>
                            <PlusIcon /> {t('add-btn-label')}
                        </Button>
                    </form>
                );
            }}
        />
    );
};
