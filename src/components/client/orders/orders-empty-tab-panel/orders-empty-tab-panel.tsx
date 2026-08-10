import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { Paper } from '@/components/common/paper/paper';
import { OrderStatisticsGroup } from '@/enums/order/order-statistics-group';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { useMeAdmin, useMeDriverRelated, useMeShipper } from '@hooks';
import { MagnifyingGlassIcon, PlusCircleIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderStatisticsGroup, translateOrderStatisticsStatus } from '@utils/translate/order/translations';

import './orders-empty-tab-panel.scss';

type Props = {
    status?: OrderStatisticsStatus | OrderStatisticsStatus[];
    group?: OrderStatisticsGroup;
    title?: string;
    hideBtn?: boolean;
};

const t = translateByNamespace('client:orders-page:empty-tab-panel');
const cn = classname('orders-empty-tab-panel');

export const OrdersEmptyTabPanel = ({ status = OrderStatisticsStatus.NEW, group, title, hideBtn }: Props) => {
    const isShipper = useMeShipper();
    const isDriver = useMeDriverRelated();
    const isMeAdmin = useMeAdmin();

    const createPath = '/client/orders/create';
    const asCreatePath = '/orders/create';

    const loadboardPath = useMemo((): string => `/${isMeAdmin ? 'admin' : 'client'}/loadboard`, [isMeAdmin]);
    const asLoadboardPath = useMemo((): string => (isMeAdmin ? '/admin/loadboard' : '/available-orders'), [isMeAdmin]);

    const statusText = useMemo((): string => {
        if (group) {
            return translateOrderStatisticsGroup(group);
        }

        const statuses = Array.isArray(status) ? status.map(translateOrderStatisticsStatus).join(', ') : translateOrderStatisticsStatus(status);

        return t('orders', { statuses });
    }, [status, group]);

    return (
        <Paper
            className={cn()}
            body={
                <div className={cn('body')}>
                    <p className={cn('main-text')}>{title || t('main-text', { statusName: statusText })}</p>
                    {!isShipper && <p className={cn('tip')}>{t(`${isDriver ? 'driver-tip' : 'tip'}`)}</p>}

                    {!hideBtn && !isDriver && (
                        <Link href={createPath} as={asCreatePath}>
                            <Button view='primary'>
                                <PlusCircleIcon /> {t('add-order-button-label')}
                            </Button>
                        </Link>
                    )}
                    {!isShipper && (
                        <Link href={loadboardPath} as={asLoadboardPath}>
                            <Button view='primary' plain={true}>
                                <MagnifyingGlassIcon /> {t('find-orders-button-label')}
                            </Button>
                        </Link>
                    )}
                </div>
            }
        />
    );
};
