import React from 'react';

import { Button, ButtonProps } from '@/components/common';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:components:button');

export const SaveButton = ({ view = 'primary', ...props }: Omit<ButtonProps, 'children'>) => (
    <Button view={view} {...props}>
        {t('save')}
    </Button>
);
