import React from 'react';

import { PROJECT_KEY_NAME } from '@constants';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';

import { FieldOrEmptyZone } from './attachments-field-or-empty-zone';
import { useAttachmentsForm } from './useAttachmentsForm';

import './attachments-form.scss';

const cn = classname('attachments-form');
const t = translateByNamespace('client:order');
const fuT = translateByNamespace('common:file-uploader');

export const AttachmentsCreateBody = ({ disabled = false }: { disabled?: boolean }) => {
    const { othersAttachmentsTitle, isAttachmentsGroupVisible } = useAttachmentsForm();

    return (
        <div className={cn('', { row: isFreightX })}>
            {isAttachmentsGroupVisible && (
                <>
                    <FieldOrEmptyZone
                        disabled={disabled}
                        name='cdContract'
                        label={fuT(`${PROJECT_KEY_NAME}-cd-contract-label`)}
                        emptyLabel={t(`${PROJECT_KEY_NAME}-no-cd-contract-label`)}
                        title={t(`attachments.${PROJECT_KEY_NAME}-cd-contract-title`)}
                        className={cn('cd-contract')}
                        isRequired={true}
                    />
                    <FieldOrEmptyZone
                        disabled={disabled}
                        name='bolAttachments'
                        label={fuT('bol-label')}
                        emptyLabel={t('no-bol-label')}
                        title={t('attachments.bol-title')}
                        className={cn('bol')}
                        isMultiFiles={isFreightX}
                    />
                    {isFreightX && (
                        <FieldOrEmptyZone
                            disabled={disabled}
                            name='podAttachments'
                            label={fuT('pod-label')}
                            emptyLabel={t('no-pod-label')}
                            title={t('attachments.pod-title')}
                            className={cn('pod')}
                            isMultiFiles={true}
                        />
                    )}
                </>
            )}
            <FieldOrEmptyZone
                disabled={disabled}
                name='attachments'
                emptyLabel={t('no-attachments-label')}
                title={othersAttachmentsTitle}
                isMultiFiles={true}
                className={cn('others')}
            />
        </div>
    );
};
