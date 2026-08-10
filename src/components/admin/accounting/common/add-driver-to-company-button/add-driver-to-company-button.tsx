import React, { MouseEvent, useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import PlusIcon from '@/assets/icons/plus.svg';

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
