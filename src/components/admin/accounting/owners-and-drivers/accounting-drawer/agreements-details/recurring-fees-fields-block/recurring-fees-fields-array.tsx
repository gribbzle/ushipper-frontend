import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { FeesFieldsWrapper } from '@/components/admin/accounting/common/fees-fields-wrapper';
import { Button } from '@/components/common/button/button';
import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';
import { FeePeriod } from '@/enums/fee/fee-periods-enum';
import { useDriversActionsPermission } from '@/hooks/accounting/use-drivers-actions-permission';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { EditRecurringFeeItem } from './edit-recurring-fee-item';

import './recurring-fees-fields-array.scss';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

const cn = classname('recurring-fees-fields-array');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

const FEE_TYPE = 'recurringFees';

const renderAddRecurringFeeButton = ({ fields, disabled }: { fields: any; disabled: boolean }) => (
    <Button
        plain={true}
        view='primary'
        size='small'
        disabled={disabled}
        onClick={() =>
            fields.push({
                valueType: FeeCategoryValueType.FIXED,
                period: FeePeriod.WEEKLY,
            })
        }
    >
        <PlusCircleIcon /> {t('add-fee')}
    </Button>
);

export const RecurringFeesFieldsArray = ({ fieldsName, disabledButton }: { fieldsName: string; disabledButton: boolean }) => {
    const form = useForm();
    const hasDriversActionsPermission = useDriversActionsPermission();

    const handleFeeDelete = useCallback(
        (index: number) => {
            const deletedFeesId = form.getState().values[fieldsName][FEE_TYPE][index]?.feeId;

            form.mutators.remove(`[${fieldsName}][${FEE_TYPE}]`, index);

            if (deletedFeesId) {
                form.batch(() => {
                    form.mutators.push(`deleted_${fieldsName}`, deletedFeesId);
                });
            }
        },
        [form, fieldsName],
    );

    return (
        <FeesFieldsWrapper title={t('recurring-fees-title')} className={cn()}>
            <FieldArray name={`${fieldsName}.${FEE_TYPE}`}>
                {({ fields }) => (
                    <>
                        {fields.map((name, index) => (
                            <EditRecurringFeeItem
                                prefix={name}
                                key={name}
                                handleRemove={() => handleFeeDelete(index)}
                                disabled={!hasDriversActionsPermission}
                            />
                        ))}
                        {hasDriversActionsPermission && renderAddRecurringFeeButton({ fields, disabled: disabledButton })}
                    </>
                )}
            </FieldArray>
        </FeesFieldsWrapper>
    );
};
