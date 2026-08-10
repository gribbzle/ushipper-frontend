import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { Button, ButtonProps } from './button';
import DownloadIcon from '@/assets/icons/download.svg';
import LoaderIcon from '@/assets/icons/small-loader.svg';

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
