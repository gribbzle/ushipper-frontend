import React, { useCallback, useMemo, useState } from 'react';
import has from 'has-values';
import { useRouter } from 'next/router';

import { OrderInternalNoteForm } from '@/components/client/orders/forms/order-internal-note-form/order-internal-note-form';
import { CreateEditOrderInternalNotePopup } from '@/components/client/orders/popups/create-edit-order-internal-note-popup/create-edit-order-internal-note-popup';
import { DeleteOrderInternalNotePopup } from '@/components/client/orders/popups/delete-order-internal-note-popup/delete-order-internal-note-popup';
import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { NotificationItem } from '@/components/common/notification-item/notification-item';
import { Paper } from '@/components/common/paper/paper';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useCanManageOrder } from '@/hooks/order/use-can-manage-order';
import { useAppDispatch } from '@store';
import { OrderInternalNote, useGetOrderInternalNotesQuery } from '@store/api/order-internal-notes-api';
import { ModeStateEnum, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-internal-notes-paper.scss';
import ActionsIcon from '@/assets/icons/actions-icon.svg';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';

const cn = classname('order-internal-notes');
const t = translateByNamespace('client:order:internal-notes');

type FilledBlockProps = {
    orderId: string;
    internalNotes?: OrderInternalNote[];
    cursor?: string | null;
    onShowMoreClick: () => void;
};

const FilledBlock = ({ orderId, internalNotes = [], cursor, onShowMoreClick }: FilledBlockProps) => {
    const dispatch = useAppDispatch();
    const canPerformActions = useCanManageOrder();

    const handleCreateInternalNotePopupOpen = useCallback(() => {
        dispatch(
            ordersActions.setCreateEditInternalNoteModalProps({
                isVisible: true,
                publicOrderId: orderId,
                mode: ModeStateEnum.CREATE,
            }),
        );
    }, [dispatch, orderId]);

    const handleEditInternalNotePopupOpen = useCallback(
        (internalNote: OrderInternalNote) => {
            dispatch(
                ordersActions.setCreateEditInternalNoteModalProps({
                    isVisible: true,
                    internalNoteId: internalNote.publicId,
                    publicOrderId: orderId,
                    initialText: internalNote.text,
                    mode: ModeStateEnum.EDIT,
                }),
            );
        },
        [dispatch, orderId],
    );

    const handleDeleteInternalNotePopupOpen = useCallback(
        (internalNote: OrderInternalNote) => {
            dispatch(
                ordersActions.setDeleteInternalNoteModalProps({
                    isVisible: true,
                    internalNoteId: internalNote.publicId,
                    publicOrderId: orderId,
                }),
            );
        },
        [dispatch, orderId],
    );

    return (
        <Paper
            title={t('header')}
            actions={
                canPerformActions && (
                    <Button size='small' onClick={handleCreateInternalNotePopupOpen}>
                        {t('add-button-label')}
                    </Button>
                )
            }
            body={
                <>
                    <div className={cn('list')}>
                        {internalNotes.map(internalNote => (
                            <NotificationItem
                                key={internalNote.publicId}
                                user={internalNote.creator}
                                date={new Date(internalNote.createdAt)}
                                dropdown={
                                    canPerformActions ? (
                                        <Dropdown
                                            options={[
                                                {
                                                    label: t('edit-label'),
                                                    onClick: () => handleEditInternalNotePopupOpen(internalNote),
                                                },
                                                {
                                                    label: t('delete-label'),
                                                    onClick: () => handleDeleteInternalNotePopupOpen(internalNote),
                                                },
                                            ]}
                                        >
                                            <ActionsIcon />
                                        </Dropdown>
                                    ) : null
                                }
                            >
                                <p className={cn('text')}>{internalNote.text}</p>
                            </NotificationItem>
                        ))}
                    </div>
                    {cursor && canPerformActions && (
                        <Button view='link' active={true} size='mini' onClick={onShowMoreClick}>
                            <ArrowDownIcon /> {t('show-more-button-label')}
                        </Button>
                    )}
                </>
            }
            className={cn('')}
        />
    );
};

export const OrderInternalNotesPaper = () => {
    const [cursor, setCursor] = useState<string | undefined>();
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const { data: response } = useGetOrderInternalNotesQuery({ orderId, cursor }, { skip: !has(orderId) });

    const canPerformActions = useCanManageOrder();

    const handleShowMoreClick = useCallback(() => {
        setCursor(response?.nextCursor || undefined);
    }, [response?.nextCursor]);

    const paperBody = useMemo(
        () =>
            canPerformActions ? (
                <OrderInternalNoteForm />
            ) : (
                <ZoneButton label={t('no-internal-notes')} onClick={() => undefined} disabled={!canPerformActions} />
            ),
        [canPerformActions],
    );

    return response && (has(response.internalNotes) || response.nextCursor) ? (
        <>
            <FilledBlock orderId={orderId} cursor={response.nextCursor} internalNotes={response.internalNotes} onShowMoreClick={handleShowMoreClick} />
            {canPerformActions && (
                <>
                    <DeleteOrderInternalNotePopup />
                    <CreateEditOrderInternalNotePopup />
                </>
            )}
        </>
    ) : (
        <Paper title={t('header')} body={paperBody} className={cn('', ['no-print'])} />
    );
};
