import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-item-validation-popup.scss';

const t = translateByNamespace('client:order:validation');
const cn = classname('validation-popup');

type Props = {
    isOpened: boolean;
    errors: string[];
    onClose: () => void;
    navigateToOrder: () => void;
};
export default function OrderItemValidationPopup({ isOpened, errors, onClose, navigateToOrder }: Props) {
    const description = useMemo(() => {
        return (
            <div className={cn('errors-wrapper')}>
                {errors.map(error => (
                    <div className={cn('error-item')} key={error}>
                        <span className={cn('dot')} /> {error}
                    </div>
                ))}
            </div>
        );
    }, [errors]);

    const actions = useMemo(() => {
        return (
            <div className={cn('action')}>
                <Button size='small' onClick={onClose}>
                    {t('cancel')}
                </Button>
                <Button size='small' view='primary' onClick={navigateToOrder}>
                    {t('edit-order')}
                </Button>
            </div>
        );
    }, [onClose, navigateToOrder]);

    return <Popup className={cn()} isOpen={isOpened} description={description} onClose={onClose} title={t('title')} actions={actions} />;
}
