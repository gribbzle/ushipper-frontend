import React from 'react';

import { Button } from '@/components/common/button/button';
import { classname } from '@utils/classname';

import './file-clip-button.scss';
import FileWithClipIcon from '@/assets/icons/file-with-clip.svg';

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
