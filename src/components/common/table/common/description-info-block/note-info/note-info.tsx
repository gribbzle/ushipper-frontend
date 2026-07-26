import React from 'react';

import { classname, translateByNamespace } from '@utils';

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
