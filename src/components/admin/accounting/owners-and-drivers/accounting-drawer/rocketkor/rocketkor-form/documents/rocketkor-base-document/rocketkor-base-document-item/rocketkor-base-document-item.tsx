import React from 'react';

import { File } from '@/components/client';
import { Button } from '@/components/common';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { PencilWithLineIcon, TrashIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import { fromDocumentTypeToTitle } from '../from-document-type-to-title';

import { RocketkorDocumentItemProps } from './rocketkor-base-document-item.types';

import './rocketkor-base-document-item.scss';

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
