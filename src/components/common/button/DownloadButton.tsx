import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { Button, ButtonProps } from './button';

const t = translateByNamespace('common:components:button');

export const DownloadButton = ({ view = 'primary', size = 'small', ...props }: Omit<ButtonProps, 'children'>) => (
    <Button view={view} size={size} {...props}>
        {t('download')}
    </Button>
);
