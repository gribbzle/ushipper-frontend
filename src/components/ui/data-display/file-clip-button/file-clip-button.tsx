import React from 'react';

import { Button } from '@/components/common/button/button';
import { FileWithClipIcon } from '@icons';
import { classname } from '@utils/classname';

import './file-clip-button.scss';

const cn = classname('file-clip-button');

type FileClipButtonProps = {
    onClick: () => void;
    size?: 'default' | 'small';
};

export const FileClipButton = ({ size = 'default', onClick }: FileClipButtonProps) => (
    <Button className={cn('', { size })} onClick={onClick}>
        <FileWithClipIcon />
    </Button>
);
