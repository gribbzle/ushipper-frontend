import React from 'react';

import { Paper } from '@/components/common/paper/paper';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AttachmentsCreateBody } from './attachments-create-body';
import { AttachmentsFormProps } from './attachments-form.types';
import { AttachmentsShowBody } from './attachments-show-body';

import './attachments-form.scss';

const cn = classname('order-general-form');
const t = translateByNamespace('client:order');

export const AttachmentsForm = ({ disabled, orderId }: AttachmentsFormProps) => (
    <Paper
        className={cn('attachments-paper')}
        title={t('attachments.head')}
        body={orderId ? <AttachmentsShowBody orderId={orderId} disabled={disabled} /> : <AttachmentsCreateBody disabled={disabled} />}
    />
);
