import React, { useMemo } from 'react';

import { Loader } from '@/components/common/loader/loader';
import { Popup } from '@/components/common/popup/popup';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { classname } from '@utils/classname';
import { renderTextWithBreakLines } from '@utils/render';

import { FullCheckingContractOfferBlock } from './full-checking-contract-offer-block';
import { useCheckingContractPopup } from './use-checking-contract-popup';

import './checking-contract-popup.scss';
import CloseIcon from '@/assets/icons/close-icon.svg';

const cn = classname('checking-contract-popup');

export const CheckingContractPopup = ({ loadBoardFilters }: { loadBoardFilters: LoadBoardFilters }) => {
    const { opened, orderId, parsedOrders, isChecking, message, isSuccess, head, handleClosePopup } = useCheckingContractPopup(loadBoardFilters);

    const header = useMemo(
        () => (
            <div className={cn('head')}>
                <span className={cn('title')}>{head}</span>
                {isChecking && (
                    <div className={cn('close')} onClick={() => handleClosePopup()}>
                        <CloseIcon />
                    </div>
                )}
            </div>
        ),
        [handleClosePopup, isChecking, head],
    );

    const description = useMemo(
        () => (
            <div className={cn('content')}>
                {parsedOrders ? (
                    <FullCheckingContractOfferBlock orderId={orderId} parsedOrders={parsedOrders} loadBoardFilters={loadBoardFilters} reverse={isSuccess} />
                ) : (
                    <span className={cn('empty')}>
                        {message && renderTextWithBreakLines(message)}
                        <br />
                        {!isChecking && <Loader />}
                    </span>
                )}
            </div>
        ),
        [parsedOrders, orderId, loadBoardFilters, isSuccess, message, isChecking],
    );

    return (
        <Popup
            className={cn('', { large: !!parsedOrders })}
            isOpen={opened}
            onClose={handleClosePopup}
            description={description}
            title={header}
            isClickOutside={isChecking}
        />
    );
};
