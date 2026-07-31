import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { Button, ButtonProps } from './button';

const t = translateByNamespace('common:components:button');

export const SaveButton = ({ view = 'primary', ...props }: Omit<ButtonProps, 'children'>) => (
    <Button view={view} {...props}>
        {t('save')}
    </Button>
);
