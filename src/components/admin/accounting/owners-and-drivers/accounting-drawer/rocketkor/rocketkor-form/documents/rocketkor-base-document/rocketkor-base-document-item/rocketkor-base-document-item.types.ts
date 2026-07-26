import { ReactNode } from 'react';

import { Attachment } from '@/shared';

import { RocketkorBaseDocumentProps } from '../rocketkor-base-document.types';

export type RocketkorDocumentItemProps = Pick<RocketkorBaseDocumentProps, 'type'> & {
    file: Attachment;
    body: ReactNode;
    handleEdit: () => void;
    handleDelete: () => void;
};
