import React from 'react';

import { Button, ButtonProps } from '@/components/common';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:components:button');

export const CancelButton = ({ view = 'default', size = 'small', ...props }: Omit<ButtonProps, 'children'>) => (
    <Button view={view} size={size} {...props}>
        {t('cancel')}
    </Button>
);
