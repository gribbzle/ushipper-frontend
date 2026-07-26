import React, { useCallback, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { Button, Drawer, Link, OrderDispatcherAssignItem } from '@components';
import { TextField } from '@fields';
import { ExternalLinkIcon, UserMinusIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersApi } from '@store/api/orders-api';
import { Dispatcher, GetDispatchersParams, useGetDispatchersQuery } from '@store/api/users-api';
import { orderFormSubmitAction, ordersActions, orderSetDispatcherDrawerPropsSelector } from '@store/client';
import { staffActions } from '@store/common/staff/slice';
import { List } from '@ui';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import './order-set-dispatcher-drawer.scss';

const t = translateByNamespace('client:order:assign-to-dispatcher');
const cn = classname('order-set-dispatcher-drawer');

type SearchForm = {
    name?: string;
};

export const OrderSetDispatcherDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, orderId, selectedUserId } = useAppSelector(orderSetDispatcherDrawerPropsSelector);
    const [params, setParams] = useState<GetDispatchersParams>({});
    const { data: dispatchers } = useGetDispatchersQuery(params);

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setDispatcherDrawerProps({
                isVisible: false,
                orderId: null,
            }),
        );
    }, [dispatch]);

    const handleSetDispatcher = useCallback(
        (dispatcher: Dispatcher | null) => {
            if (orderId) {
                dispatch(
                    orderFormSubmitAction({
                        publicId: orderId,
                        dispatcherId: dispatcher?.publicId ?? null,
                    }),
                )
                    .unwrap()
                    .then(() => {
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }]));
                    })
                    .catch(e => console.log(e));
            }

            handleClose();
        },
        [dispatch, handleClose, orderId],
    );

    const handleAddClick = useCallback(async () => {
        handleClose();
        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'create', userId: null }));
    }, [dispatch, handleClose]);

    const handleSubmitForm = useCallback((values: SearchForm) => {
        setParams(prevState => ({ ...prevState, name: values.name, cursor: undefined }));
    }, []);

    const actions = useMemo(
        () => (
            <>
                {selectedUserId && (
                    <Button onClick={() => handleSetDispatcher(null)}>
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
        [selectedUserId, handleAddClick, handleSetDispatcher],
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
                        onSubmit={handleSubmitForm}
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
                    <List<Dispatcher>
                        className={cn('dispatcher-list')}
                        data={dispatchers?.data}
                        onEndReached={() => {
                            const nextCursor = dispatchers?.meta?.nextCursor;

                            if (nextCursor) {
                                setParams(prevState => ({
                                    ...prevState,
                                    cursor: nextCursor,
                                }));
                            }
                        }}
                        renderItem={({ item }) => (
                            <OrderDispatcherAssignItem
                                disabled={selectedUserId === item.publicId}
                                key={item.publicId}
                                name={item.name}
                                nickname={item.nickname}
                                phone={item.phone}
                                onClick={() => handleSetDispatcher(item)}
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
