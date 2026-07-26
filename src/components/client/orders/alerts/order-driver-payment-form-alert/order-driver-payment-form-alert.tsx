import React, { useCallback, useMemo } from 'react';

import { DeclineOrPayToDriverPopup } from '@/components/admin';
import { AlertBlock, Button, CodCopOrdersActionTag } from '@/components/common';
import { InstantTermPaymentType } from '@/enums';
import { useInstantPaymentAttachments, useOpenDriverPaymentFormDrawer, useOrdersActionsPermission } from '@/hooks/order';
import { getPaymentMethodTranslate } from '@/utils/payment';
import {
    classname,
    convertAmountToCurrency,
    convertBytesToMB,
    convertPriceToCurrency,
    getDriverPaymentRecipientTranslate,
    getOrderCheckStatuses,
    renderTextWithBreakLines,
    translateActionRequired,
    translateByNamespace,
    translatePaymentForm,
} from '@utils';

import { ORDER_DRIVER_PAYMENT_FORM_ALERT_VIEW } from './constants';
import { OrderDriverPaymentFormAlertProps, OrderDriverPaymentFormAlertViewVariant } from './order-driver-payment-form-alert.types';

import './order-driver-payment-form-alert.scss';

const t = translateByNamespace('client:order:driver-payment-form');
const tAlert = translateByNamespace('client:order:payment-information:alert');
const cn = classname('driver-payment-form-alert');

// TODO Improve the architecture

export const OrderDriverPaymentFormAlert = ({ order, context = 'driver', isFullDetailed = true, size, headerSize }: OrderDriverPaymentFormAlertProps) => {
    const {
        publicId,
        driverFeeCharge,
        instantTermPaymentType,
        instantTermPaymentMethod,
        price,
        instantTermPaymentDeclineReason,
        instantTermDeclinedAt,
        instantTermPaidAt,
    } = order || {};

    const isDriverContext = context === 'driver';
    const hasOrdersActionsPermission = useOrdersActionsPermission();
    const { latestPaymentDocument, uploadPaymentDocumentHandler } = useInstantPaymentAttachments(publicId);

    const { isPaymentAccepted, isPaymentDeclined } = useMemo(() => {
        const { isCheckDeclined, isOrderCheckCompanyPaid } = getOrderCheckStatuses(instantTermPaymentType);

        return {
            isPaymentAccepted: isOrderCheckCompanyPaid,
            isPaymentDeclined: isCheckDeclined,
        };
    }, [instantTermPaymentType]);

    const title = useMemo(
        (): string => (instantTermPaymentType ? translatePaymentForm(instantTermPaymentType) : translateActionRequired()),
        [instantTermPaymentType],
    );

    const variant = useMemo(
        (): OrderDriverPaymentFormAlertViewVariant => ORDER_DRIVER_PAYMENT_FORM_ALERT_VIEW.get(instantTermPaymentType ?? null)!,
        [instantTermPaymentType],
    );

    const content = useMemo(() => {
        if (!instantTermPaymentType) {
            if (isDriverContext) {
                return (
                    <>
                        {isFullDetailed && (
                            <>
                                <p>{t('required-description-prefix')}</p>
                                <p>
                                    {t('required-fee-description-prefix')} <strong>{convertAmountToCurrency(driverFeeCharge?.amount)}</strong>{' '}
                                    {t('required-fee-description-suffix')}
                                </p>
                            </>
                        )}
                        <p>{t('required-description-for-driver')}</p>
                    </>
                );
            }

            return (
                <p>
                    <strong>
                        {convertAmountToCurrency(driverFeeCharge?.amount)} {tAlert('fee')}
                    </strong>{' '}
                    {tAlert('is-delivered-charged-fee')}
                    {renderTextWithBreakLines(t('required-description-for-admin'))}
                </p>
            );
        }

        return (
            <div className={cn('content')}>
                {isFullDetailed && (
                    <>
                        <p>
                            {t('recipient-label')} <strong>{getDriverPaymentRecipientTranslate(instantTermPaymentType)}</strong>
                        </p>
                        {instantTermPaymentMethod && (
                            <p>
                                {t('payment-method-label')} <strong>{getPaymentMethodTranslate(instantTermPaymentMethod)}</strong>
                            </p>
                        )}
                    </>
                )}
                {isDriverContext && (
                    <>
                        {!!latestPaymentDocument && isFullDetailed && (
                            <p className={cn('link-label')}>
                                {t('file-label')}{' '}
                                <span className={cn('link')} onClick={() => uploadPaymentDocumentHandler(latestPaymentDocument)}>
                                    {t('file-info-text', {
                                        fileName: latestPaymentDocument.name,
                                        fileSize: `${convertBytesToMB(latestPaymentDocument.size)} Mb`,
                                    })}
                                </span>
                            </p>
                        )}
                        {isPaymentAccepted && (
                            <p>
                                <strong>{convertPriceToCurrency(price ?? 0)}</strong> {t('accepted-description')}
                            </p>
                        )}
                        {isPaymentDeclined && (
                            <>
                                {isFullDetailed && (
                                    <p>
                                        <strong>{convertPriceToCurrency(price ?? 0)}</strong> {t('declined-description')}
                                    </p>
                                )}
                                {!!instantTermPaymentDeclineReason && (
                                    <div className={cn('row')}>
                                        <p>{t('declined-reason-label')}</p> <strong>{instantTermPaymentDeclineReason}</strong>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
                {!isDriverContext && (
                    <>
                        {order && (
                            <div className={cn('row')}>
                                <p>{t('receipt-status-label')}</p>
                                <CodCopOrdersActionTag
                                    inline={true}
                                    driverPay={price}
                                    publicId={order.publicId}
                                    driver={order.driver}
                                    instantTermPaymentType={instantTermPaymentType}
                                    declinedAt={instantTermDeclinedAt}
                                    paidAt={instantTermPaidAt}
                                />
                            </div>
                        )}
                        {isPaymentDeclined && !!instantTermPaymentDeclineReason && (
                            <div className={cn('row')}>
                                <p>{t('declined-reason-label')}</p> <span className={cn('row-value')}>{instantTermPaymentDeclineReason}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }, [
        instantTermPaymentType,
        isFullDetailed,
        instantTermPaymentMethod,
        isDriverContext,
        latestPaymentDocument,
        isPaymentAccepted,
        price,
        isPaymentDeclined,
        instantTermPaymentDeclineReason,
        order,
        instantTermDeclinedAt,
        instantTermPaidAt,
        driverFeeCharge?.amount,
        uploadPaymentDocumentHandler,
    ]);

    const openDriverPaymentFormDrawer = useOpenDriverPaymentFormDrawer();

    const handlePaymentFormBtnClick = useCallback(() => {
        if (publicId) {
            openDriverPaymentFormDrawer({
                orderId: publicId,
                attachment: latestPaymentDocument,
                instantTermPaymentType: instantTermPaymentType ?? null,
                instantTermPaymentMethod,
            });
        }
    }, [openDriverPaymentFormDrawer, publicId, latestPaymentDocument, instantTermPaymentType, instantTermPaymentMethod]);

    const actions = useMemo(() => {
        if (context === 'admin' && !hasOrdersActionsPermission) {
            return null;
        }

        if (!instantTermPaymentType) {
            return (
                <Button view='primary' plain={true} size='small' onClick={handlePaymentFormBtnClick}>
                    {t('send-payment-form-btn-label')}
                </Button>
            );
        }

        if ([InstantTermPaymentType.RECIPIENT_COMPANY, InstantTermPaymentType.RECIPIENT_DRIVER].includes(instantTermPaymentType)) {
            return (
                <Button onClick={handlePaymentFormBtnClick} size='small'>
                    {t('edit-payment-form-btn-label')}
                </Button>
            );
        }

        if (isPaymentDeclined) {
            return (
                <Button onClick={handlePaymentFormBtnClick} size='small'>
                    {t('resend-payment-form-btn-label')}
                </Button>
            );
        }

        return null;
    }, [context, hasOrdersActionsPermission, instantTermPaymentType, isPaymentDeclined, handlePaymentFormBtnClick]);

    return (
        <>
            {!isDriverContext && <DeclineOrPayToDriverPopup />}

            <AlertBlock view={variant} className={cn('', { size })}>
                <div className={cn('wrapper')}>
                    <h4 className={cn('header', { size: headerSize })}>{title}</h4>
                    {content}
                    {actions}
                </div>
            </AlertBlock>
        </>
    );
};
