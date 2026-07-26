import React from 'react';

import { Button, ButtonProps } from '@/components/common';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:components:button');

export const DownloadButton = ({ view = 'primary', size = 'small', ...props }: Omit<ButtonProps, 'children'>) => (
    <Button view={view} size={size} {...props}>
        {t('download')}
    </Button>
);
