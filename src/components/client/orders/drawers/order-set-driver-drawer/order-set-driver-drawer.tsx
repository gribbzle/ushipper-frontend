import React, { useCallback, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { OrderDriverAssignItem } from '@/components/client/orders/order-driver-assign-item/order-driver-assign-item';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { Link } from '@/components/common/link/link';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import {TextField} from '@/fields/text-field';
import { ExternalLinkIcon, UserMinusIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersApi } from '@store/api/orders-api';
import { Driver, GetDriversParams, useGetDriversQuery } from '@store/api/users-api';
import { orderFormSubmitAction, ordersActions, orderSetDriverDrawerPropsSelector } from '@store/client';
import { staffActions } from '@store/common/staff/slice';
import { List } from '@/components/ui/data-display/list';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import './order-set-driver-drawer.scss';

const t = translateByNamespace('client:order:assign-to-driver');
const translateError = translateByNamespace('client:order');
const cn = classname('order-set-driver-drawer');

type SearchForm = {
    name?: string;
};

export const OrderSetDriverDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, orderId, selectedUserId } = useAppSelector(orderSetDriverDrawerPropsSelector);
    const [params, setParams] = useState<GetDriversParams>({});
    const { data: drivers } = useGetDriversQuery(params);

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setDriverDrawerProps({
                isVisible: false,
                orderId: null,
            }),
        );
    }, [dispatch]);

    const handleSetDriver = useCallback(
        (driver: Driver | null) => {
            if (orderId) {
                dispatch(
                    orderFormSubmitAction({
                        publicId: orderId,
                        driverId: driver?.publicId ?? null,
                    }),
                )
                    .unwrap()
                    .then(() => {
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }]));
                    })
                    .catch(error => {
                        if (error.response.status === 422) {
                            const err = error.response;

                            parseAndShowAxiosError(err, translateError<string>('update-error-notification'));
                        } else {
                            toast.error(translateError<string>('update-error-notification'));
                        }
                    });
            }

            handleClose();
        },
        [dispatch, handleClose, orderId],
    );

    const handleAddClick = useCallback(async () => {
        handleClose();
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch, handleClose]);

    const handleFormSubmit = useCallback((values: SearchForm) => {
        setParams(prevState => ({ ...prevState, name: values.name, cursor: undefined }));
    }, []);

    const actions = useMemo(
        () => (
            <>
                {selectedUserId && (
                    <Button onClick={() => handleSetDriver(null)}>
                        <UserMinusIcon /> {t('un-assign-btn-label')}
                    </Button>
                )}
                <Link href='/client/staff'>
                    <Button view='primary' onClick={handleAddClick}>
                        <ExternalLinkIcon /> {t('add-new-btn-label')}
                    </Button>
                </Link>
            </>
        ),
        [selectedUserId, handleAddClick, handleSetDriver],
    );

    return (
        <Drawer
            isOpen={isVisible}
            onClose={handleClose}
            head={t('drawer-header')}
            size='small'
            body={
                <>
                    <Form<SearchForm>
                        subscription={{ values: true }}
                        onSubmit={handleFormSubmit}
                        render={({ handleSubmit }) => (
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                            >
                                <FormValuesSpy onChange={handleSubmit} debounceTime={300} />
                                <Field name='name' component={TextField} placeholder={t('search-placeholder')} />
                            </form>
                        )}
                    />
                    <List<Driver>
                        className={cn('driver-list')}
                        data={drivers?.data}
                        onEndReached={() => {
                            const nextCursor = drivers?.meta?.nextCursor;

                            if (nextCursor) {
                                setParams(prevState => ({
                                    ...prevState,
                                    cursor: nextCursor,
                                }));
                            }
                        }}
                        renderItem={({ item }) => (
                            <OrderDriverAssignItem
                                key={item.publicId}
                                disabled={selectedUserId === item.publicId}
                                name={item.name}
                                phone={item.phone}
                                vehicles={t('trailer-capacity', { trailerCapacity: item.trailerCapacity })}
                                onClick={() => handleSetDriver(item)}
                            />
                        )}
                        ListEmptyComponent={<div className={cn('not-found-message')}>{t('not-found-message')}</div>}
                    />
                </>
            }
            actions={actions}
            className={cn()}
            bodyClassName={cn('body')}
        />
    );
};
