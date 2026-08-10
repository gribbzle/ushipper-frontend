import React from 'react';

import { File } from '@/components/client/job-offers/attachments-info-column';
import { Button } from '@/components/common/button';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { fromDocumentTypeToTitle } from '../from-document-type-to-title';

import { RocketkorDocumentItemProps } from './rocketkor-base-document-item.types';

import './rocketkor-base-document-item.scss';
import PencilWithLineIcon from '@/assets/icons/pencil-with-line.svg';
import TrashIcon from '@/assets/icons/trash-can.svg';

const cn = classname('rocketkor-base-document-item');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const RocketkorBaseDocumentItem = ({ type, file, body, handleEdit, handleDelete }: RocketkorDocumentItemProps) => {
    const { downloadAttachment } = useDownloadAttachment();

    return (
        <div className={cn('')}>
            <div className={cn('header')}>
                <div className={cn('title')}>{fromDocumentTypeToTitle.get(type)}</div>
                <div className={cn('actions')}>
                    <Button onClick={handleEdit} view='default' size='mini'>
                        <PencilWithLineIcon /> {t('edit')}
                    </Button>
                    <Button onClick={handleDelete} view='danger' size='mini'>
                        <TrashIcon /> {t('delete')}
                    </Button>
                </div>
            </div>
            {body}
            <File name={file.name} size={file.size} onItemClickCallback={() => downloadAttachment(file)} />
        </div>
    );
};
