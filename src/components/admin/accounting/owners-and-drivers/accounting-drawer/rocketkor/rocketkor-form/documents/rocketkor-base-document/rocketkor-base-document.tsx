import React from 'react';

import { AccountingZoneButton } from '@/components/admin/accounting/common';

import { fromDocumentTypeToTitle } from './from-document-type-to-title';
import { RocketkorBaseDocumentProps } from './rocketkor-base-document.types';
import { RocketkorBaseDocumentItem } from './rocketkor-base-document-item';
import { useRocketkorBaseDocument } from './use-rocketkor-base-document';

export const RocketkorBaseDocument = ({ type, handleAdd, renderDocumentBody }: RocketkorBaseDocumentProps) => {
    const { document, handleEdit, handleDelete } = useRocketkorBaseDocument(type);

    return document ? (
        <RocketkorBaseDocumentItem
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            body={renderDocumentBody(document)}
            type={type}
            file={document.attachment}
        />
    ) : (
        <AccountingZoneButton text={String(fromDocumentTypeToTitle.get(type))} onClick={handleAdd} />
    );
};
