import { MutableRefObject, useCallback } from 'react';
import { FormApi } from 'final-form';

import { FeeTermTypeFields } from '@/components/admin/accounting/common/fees-fields-wrapper/fees-fields-wrapper';
import { CarrierAccountingDrawerFormValue } from '../carrier-accounting-drawer.types';

export const useFeesFieldsBlock = (formRef: MutableRefObject<FormApi<CarrierAccountingDrawerFormValue> | undefined>) => {
    const handleFeeDelete = useCallback(
        (index: number, feeType: FeeTermTypeFields) => {
            if (formRef.current) {
                const fees = formRef.current.getState().values[feeType];
                const deletedFeesId = fees[index]?.feeId;

                formRef.current.mutators.remove(feeType, index);

                if (deletedFeesId) {
                    formRef.current.batch(() => {
                        formRef.current?.mutators.push(`deleted${feeType.charAt(0).toUpperCase() + feeType.slice(1)}`, deletedFeesId);
                    });
                }
            }
        },
        [formRef],
    );

    return { handleFeeDelete };
};
