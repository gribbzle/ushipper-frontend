import React, { useCallback, useMemo } from 'react';

import { OrderInstructionsDrawer } from '@/components/client/orders/drawers/order-driver-instructions-drawer/order-instructions-drawer';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { TextAccordion } from '@/components/common/text-accordion/text-accordion';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { UserRoleGroup } from '@/enums/user-role-group';
import { useCanManageOrder } from '@/hooks/order';
import { useUserRoleGroup } from '@/hooks/use-user-role-group';
import { PencilIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDetailsSelector, ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-driver-instructions-paper.scss';

const t = translateByNamespace('client:order:driver-instructions');
const detailsF = translateByNamespace('client:order:details:fields');
const cn = classname('driver-instructions-paper');

type FilledBlockProps = {
    onDrawerOpen?: () => void;
    instructions: string;
    title: string;
};

const FilledBlock = ({ onDrawerOpen, instructions, title }: FilledBlockProps) => (
    <div className={cn()}>
        <span className={cn('title')}>
            {title} {onDrawerOpen && <IconButton size='mini' Icon={PencilIcon} onClick={onDrawerOpen} />}
        </span>
        <TextAccordion text={instructions} />
    </div>
);

export const OrderInstructions = () => {
    const dispatch = useAppDispatch();
    const details = useAppSelector(orderDetailsSelector);
    const canPerformActions = useCanManageOrder();
    const userRoleGroup = useUserRoleGroup();

    const isShipperContext = useMemo(() => {
        return userRoleGroup === UserRoleGroup.SHIPPERS;
    }, [userRoleGroup]);

    const instructions = useMemo(() => {
        return isShipperContext ? details?.instructions : details?.driverInstructions;
    }, [isShipperContext, details]);

    const handleDriverInstructionsDrawerOpen = useCallback(() => {
        dispatch(
            ordersActions.setDriverInstructionsDrawerProps({
                isVisible: true,
            }),
        );
    }, [dispatch]);

    const title = useMemo((): string => (canPerformActions ? t('empty-label') : t('no-data-label')), [canPerformActions]);

    return (
        <>
            {instructions ? (
                <FilledBlock
                    title={isShipperContext ? detailsF('order-instructions') : detailsF('driver-instructions-label')}
                    onDrawerOpen={canPerformActions ? handleDriverInstructionsDrawerOpen : undefined}
                    instructions={instructions}
                />
            ) : (
                <ZoneButton
                    label={isShipperContext ? t('shipper-empty-label') : title}
                    onClick={handleDriverInstructionsDrawerOpen}
                    disabled={!canPerformActions}
                />
            )}
            {canPerformActions && <OrderInstructionsDrawer />}
        </>
    );
};
