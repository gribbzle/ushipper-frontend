import React, { useMemo } from 'react';

import { RocketkorCompleteForm } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/rocketkor';
import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useEditRocketkorProfilePopup } from './use-edit-rocketkor-profile-popup';

import './edit-rocketkor-profile-popup.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

const cn = classname('edit-rocketkor-profile-popup');

export const EditRocketkorProfileAccountPopup = () => {
    const { isPopupOpened, isLoading, rocketkorFormId, handleClosePopup } = useEditRocketkorProfilePopup();

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' type='submit' form={rocketkorFormId} hasLoader={isLoading}>
                    {tActions('save')}
                </Button>
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {tActions('cancel')}
                </Button>
            </>
        ),
        [rocketkorFormId, isLoading, handleClosePopup],
    );

    return (
        <Popup
            className={cn()}
            size='large'
            isOpen={isPopupOpened}
            onTop={true}
            onClose={handleClosePopup}
            title={t('title')}
            description={<RocketkorCompleteForm handleCloseForm={handleClosePopup} />}
            actions={actions}
        />
    );
};
