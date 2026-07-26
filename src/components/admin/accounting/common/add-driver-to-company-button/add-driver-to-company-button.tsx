import React, { MouseEvent, useCallback } from 'react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/common';
import { PlusIcon } from '@icons';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { translateByNamespace } from '@utils';

type AddDriverToCompanyButtonProps = {
    disabled: boolean;
    name: string;
    email: string;
};

const t = translateByNamespace('admin:accounting:owners-and-drivers:table');
const tTable = translateByNamespace('common:staff-table');

export const AddDriverToCompanyButton = ({ name, email, disabled }: AddDriverToCompanyButtonProps) => {
    const dispatch = useAppDispatch();

    const handleOpenAddDriverToCompanyPopup = useCallback(
        async (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            dispatch(accountingActions.setAddDriverToCompanyPopupProps({ isPopupOpened: true, name, email }));
        },
        [dispatch, name, email],
    );

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button onClick={event => handleOpenAddDriverToCompanyPopup(event)} size='small' disabled={!disabled}>
                    <PlusIcon />
                    {tTable('add')}
                </Button>
            </TooltipTrigger>
            {!disabled && <TooltipContent>{t('no-verified-email')}</TooltipContent>}
        </Tooltip>
    );
};
