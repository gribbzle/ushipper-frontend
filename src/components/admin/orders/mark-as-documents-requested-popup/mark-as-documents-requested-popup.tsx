import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { getOrderIdLabel } from '@/utils/order';
import { useAppDispatch, useAppSelector } from '@store';
import { markAsDocumentsRequestedPopupSelector, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

import { DocumentsRequestedAlert } from './documents-requested-alert';
import { DocumentsRequestedFormState, MarkAsDocumentsRequestedForm } from './mark-as-documents-requested-form';

import './mark-as-documents-requested-popup.scss';

const t = translateByNamespace('admin:orders-page:mark-as-documents-requested-popup');
const cn = classname('mark-as-documents-requested-popup');

export const MarkAsDocumentsRequestedPopup = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<DocumentsRequestedFormState>>();

    const { isVisible, orderPublicId, orderId } = useAppSelector(markAsDocumentsRequestedPopupSelector);

    const handleSubmitClick = useCallback(() => formRef.current?.submit(), []);

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setMarkAsDocumentsRequestedPopupProps({
                isVisible: false,
                orderPublicId: null,
                orderId: null,
            }),
        );
    }, [dispatch]);

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='primary' onClick={handleSubmitClick}>
                    {t('confirm-btn-label')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {t('cancel-btn-label')}
                </Button>
            </>
        ),
        [handleClose, handleSubmitClick],
    );

    const description = useMemo(
        () => (
            <div className={cn('content')}>
                {orderPublicId && <DocumentsRequestedAlert orderPublicId={orderPublicId} />}
                <MarkAsDocumentsRequestedForm orderPublicId={orderPublicId} formRef={formRef} onAfterSubmit={handleClose} />
            </div>
        ),
        [handleClose, orderPublicId],
    );

    return (
        <Popup
            className={cn('')}
            size='large'
            isOpen={isVisible}
            onClose={handleClose}
            title={renderTextWithBreakLines(t('title', { orderId: getOrderIdLabel(orderId) }))}
            description={description}
            actions={actions}
        />
    );
};
