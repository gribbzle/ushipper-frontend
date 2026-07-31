import React, { ReactElement, useCallback, useContext, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { BackLink } from '@/components/common/back-link/back-link';
import { Button } from '@/components/common/button/button';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { PageTitle } from '@/components/common/page-title/page-title';
import { RouterContext } from '@/components/common/router-provider/router-provider';
import { InspectionType, OrderStatus } from '@/enums';
import { useCanManageOrder, useRedirectToOrder } from '@/hooks/order';
import { useOnBack } from '@/hooks/useOnBack';
import { getOrderId } from '@/utils/order';
import { useIsAdminPage, useMeCarrier } from '@hooks';
import { PencilIcon, PrinterIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { Load, ordersActions, orderSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';
import { translateDeletedOrderStatus, translateShipperCancelledOrderStatus } from '@utils/translate/order/get-order-status-translate';

const inspectionTypeTranslate = translateByNamespace('common:inspection-types');

type Props = {
    renderActionsComponent: (order: Load) => ReactElement;
};

const PageHead = ({ renderActionsComponent }: Props) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const order = useAppSelector(orderSelector);
    const isAdminPage = useIsAdminPage();
    const canPerformActions = useCanManageOrder();

    const cn = useMemo(() => classname(isAdminPage ? 'admin-show-order-page' : 'show-order-page'), [isAdminPage]);

    const { details } = order ?? {};
    const { internalOrderId, inspectionType } = details ?? {};

    const handleEditOrderClick = useCallback(() => {
        dispatch(ordersActions.setOrderDetailsDrawerProps({ isVisible: true }));
    }, [dispatch]);

    const { redirectToOrders } = useRedirectToOrder({});
    const goBack = useOnBack();

    const { prevRouter } = useContext(RouterContext);

    const onBackHandler = async () => {
        if (prevRouter?.pathname.includes('edit')) {
            await redirectToOrders();
        } else if (prevRouter) {
            await goBack();
        } else {
            router.back();
        }
    };
    const isCarrier = useMeCarrier();

    if (!order) {
        return <></>;
    }

    const { deletedAt, shipperOrder } = order;

    return (
        <PageHeader className={cn('page-header')}>
            <div className='row'>
                <BackLink customBackHandler={onBackHandler} />
                <PageTitle title={getOrderId(order)} />
                {internalOrderId && <span className={cn('internal-order-id')}>{`(${internalOrderId})`}</span>}
                {!isFreightX && inspectionType === InspectionType.ADVANCED && <OrderTag view='advanced'>{inspectionTypeTranslate(inspectionType)}</OrderTag>}
                {deletedAt && <OrderTag view='cancelled'>{translateDeletedOrderStatus()}</OrderTag>}
                {isCarrier && shipperOrder?.status === OrderStatus.CANCELED && (
                    <OrderTag view={toKebabCase(shipperOrder.status)}>{translateShipperCancelledOrderStatus()}</OrderTag>
                )}
                {canPerformActions && <IconButton Icon={PencilIcon} onClick={handleEditOrderClick} />}
            </div>
            <div className='row'>
                {renderActionsComponent(order)}
                {canPerformActions && (
                    <Button size='medium' onClick={() => window.print()} className='print-bnt'>
                        <PrinterIcon />
                    </Button>
                )}
            </div>
        </PageHeader>
    );
};

export default PageHead;
