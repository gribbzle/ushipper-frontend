import React from 'react';

import { Button } from '@/components/common/button/button';
import { ParsedOrderRoute } from '@/components/common/parsed-order-route/parsed-order-route';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { ParsedOrderData } from '@store/client/loadboard';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { useCheckingContractItem } from './use-checking-contract-item';

import './checking-contract-item.scss';
import DownloadIcon from '@/assets/icons/download.svg';

const t = translateByNamespace('client:loadboard:checking-contract-popup');
const tOrderId = translateByNamespace('client:loadboard:load-details');

const cn = classname('checking-contract-item');

type Props = {
    loadBoardFilters: LoadBoardFilters;
    parsedOrder: ParsedOrderData;
};

export const CheckingContractItem = ({ parsedOrder, loadBoardFilters }: Props) => {
    const { handleSignContract, handleImportToUshipper, handleDownloadContract, isLoading, isLoadingDocument } = useCheckingContractItem(loadBoardFilters);
    const {
        pickupInformation,
        deliveryInformation,
        vehicles,
        orderId,
        paymentPrice,
        companyName,
        id,
        contractSignedBy,
        contractSignedAt,
        contractSignedOrderPublicId,
    } = parsedOrder;

    return (
        <div className={cn('')}>
            <div className={cn('content')}>
                <ParsedOrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} vehicles={vehicles} reverse={true} />
                <div className={cn('details')}>
                    <div className={cn('details-wrapper')}>
                        <p>{companyName}</p>
                        <span className={cn('details-order')}>{orderId && tOrderId('order-id', { orderId })}</span>
                    </div>
                    {paymentPrice && <span>{formatToCurrency(paymentPrice)}</span>}
                </div>
                {contractSignedAt && contractSignedBy && (
                    <div className={cn('signed')}>
                        {t('signed-contract-by', { name: contractSignedBy.name, time: diffForHumans(new Date(contractSignedAt), true) })}
                    </div>
                )}
            </div>
            <div className={cn('footer')}>
                {contractSignedAt ? (
                    <Button
                        hasLoader={isLoading}
                        disabled={isLoading}
                        view='primary'
                        size='small'
                        onClick={() => handleImportToUshipper(contractSignedOrderPublicId)}
                    >
                        {t('import-to-ushipper-btn')}
                    </Button>
                ) : (
                    <Button hasLoader={isLoading} disabled={isLoading} plain={true} view='primary' size='small' onClick={() => handleSignContract(id)}>
                        {t('sign-contract-btn')}
                    </Button>
                )}
                <Button plain={true} size='small' onClick={() => handleDownloadContract(id)} hasLoader={isLoadingDocument} disabled={isLoading}>
                    {!isLoadingDocument && <DownloadIcon />} {t('download-contract-btn')}
                </Button>
                {/*TODO back is not ready*/}
                {/* <Button plain={true} view='danger' size='small' onClick={() => handleCancelContract(id)}>
                    {t('cancel-contract-btn')}
                </Button> */}
            </div>
        </div>
    );
};
