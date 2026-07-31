import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './note-info.scss';

const t = translateByNamespace('admin:accounting:balance-table');
const cn = classname('note-info');

type NoteInfoProps = {
    note: string;
};

export const NoteInfo = ({ note }: NoteInfoProps) => (
    <span className={cn('note')}>
        {t('notes')}: {note}
    </span>
);
