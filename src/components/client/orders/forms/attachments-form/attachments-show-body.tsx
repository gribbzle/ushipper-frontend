import React from 'react';

import { OrderDeleteAttachmentPopup } from '@/components/client/orders/popups/order-delete-attachment-popup/order-delete-attachment-popup';
import { PROJECT_KEY_NAME } from '@constants';
import { AttachmentType } from '@enums';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';

import { AttachmentsShowBodyProps } from './attachments-form.types';
import { AttachmentsSection } from './attachments-section';
import { INITIAL_DISPLAY_COUNT } from './constants';
import { useAttachmentsForm } from './useAttachmentsForm';

import './attachments-form.scss';

const cn = classname('attachments-form');
const t = translateByNamespace('client:order');
const fuT = translateByNamespace('common:file-uploader');

export const AttachmentsShowBody = ({ orderId, disabled = false }: AttachmentsShowBodyProps) => {
    const { othersAttachmentsTitle, isAttachmentsGroupVisible } = useAttachmentsForm();

    return (
        <div className={cn('', { row: isFreightX })}>
            <OrderDeleteAttachmentPopup />

            {isAttachmentsGroupVisible && (
                <>
                    <AttachmentsSection
                        orderId={orderId}
                        title={t(`attachments.${PROJECT_KEY_NAME}-cd-contract-title`)}
                        label={fuT(`${PROJECT_KEY_NAME}-cd-contract-label`)}
                        type={AttachmentType.CD_CONTRACT}
                        isMultiFiles={false}
                        disabled={disabled}
                        className={cn('cd-contract')}
                    />
                    <AttachmentsSection
                        orderId={orderId}
                        title={t('attachments.bol-title')}
                        label={fuT('bol-label')}
                        type={AttachmentType.BOL}
                        isMultiFiles={true}
                        disabled={disabled}
                        initialDisplayCount={INITIAL_DISPLAY_COUNT}
                        className={cn('bol')}
                    />
                    {isFreightX && (
                        <AttachmentsSection
                            orderId={orderId}
                            title={t('attachments.pod-title')}
                            label={fuT('pod-label')}
                            type={AttachmentType.POD}
                            isMultiFiles={true}
                            disabled={disabled}
                            initialDisplayCount={INITIAL_DISPLAY_COUNT}
                            className={cn('pod')}
                        />
                    )}
                </>
            )}
            <AttachmentsSection
                orderId={orderId}
                title={othersAttachmentsTitle}
                label={fuT('attachments-label')}
                isMultiFiles={true}
                disabled={disabled}
                initialDisplayCount={INITIAL_DISPLAY_COUNT}
                className={cn('others')}
            />
        </div>
    );
};
