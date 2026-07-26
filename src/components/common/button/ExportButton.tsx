import React from 'react';

import { Button, ButtonProps } from '@/components/common';
import { DownloadIcon, LoaderIcon } from '@icons';
import { translateByNamespace } from '@utils';

type ExportButtonProps = Omit<ButtonProps, 'children'> & {
    isLoading: boolean;
};

const t = translateByNamespace('common:components:button');

export const ExportButton = ({ view = 'default', size = 'medium', disabled = true, isLoading = false, ...props }: ExportButtonProps) => (
    <Button view={view} size={size} disabled={disabled} {...props}>
        {isLoading ? <LoaderIcon /> : <DownloadIcon />}
        {t('export')}
    </Button>
);
