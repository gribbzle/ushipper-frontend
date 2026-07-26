import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { EditFeeItem, FeesFieldsWrapper, FeeTermTypeFields, getFeeTermTypesFieldsOfProject, renderAddButton } from '@/components/admin/accounting/common';
import { AlertBlock } from '@/components/common';
import { PROJECT_KEY_NAME } from '@constants';
import { useDriversActionsPermission } from '@hooks';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { Fee, FeeData } from '@types';
import { classname, translateByNamespace } from '@utils';

import { useDriversCompaniesFees } from '../../../hooks';

import './custom-fees-fields-array.scss';

type CustomFeesFieldsArrayProps = {
    fieldsName: string;
    disabledButton: boolean;
    users?: AccountingAccountUserData[];
};

const cn = classname('custom-fees-fields');
const tFees = translateByNamespace('admin:accounting:carrier-accounting-drawer');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements:custom-fees-warning-alert');

export const CustomFeesFieldsArray = ({ fieldsName, disabledButton, users }: CustomFeesFieldsArrayProps) => {
    const form = useForm();
    const hasDriversActionsPermission = useDriversActionsPermission();

    const handleFeeDelete = useCallback(
        (index: number, feeType: FeeTermTypeFields) => {
            const deletedFeesId = form.getState().values[fieldsName][feeType][index]?.feeId;

            form.mutators.remove(`[${fieldsName}][${feeType}]`, index);

            if (deletedFeesId) {
                form.batch(() => {
                    form.mutators.push(`deleted_${fieldsName}`, deletedFeesId);
                });
            }
        },
        [form, fieldsName],
    );

    const { delayedCompaniesFees, instantCompaniesFees } = useDriversCompaniesFees(users);

    const getMissingFees = useCallback(
        (feeType: FeeTermTypeFields, companyFees: Fee[]): Fee[] => {
            const formValues: FeeData[] = form.getState().values[fieldsName][feeType];
            const formFeeIds = formValues?.map(fee => fee.feeCategoryId) || [];
            const missingFees = companyFees.filter(companyFee => !formFeeIds.includes(companyFee.feeCategory.id));

            return missingFees;
        },
        [form, fieldsName],
    );

    return (
        <div className={cn()}>
            {getFeeTermTypesFieldsOfProject().map(feeType => {
                const companyFees = feeType === 'delayedFees' ? delayedCompaniesFees : instantCompaniesFees;
                const missingFees = getMissingFees(feeType, companyFees);

                return (
                    <FeesFieldsWrapper
                        title={tFees(`${PROJECT_KEY_NAME}-${feeType.replace('Fees', '')}-terms-title`)}
                        key={feeType}
                        isDanger={missingFees.length > 0}
                    >
                        <FieldArray name={`${fieldsName}.${feeType}`}>
                            {({ fields }) => (
                                <>
                                    {fields.map((name, index) => (
                                        <EditFeeItem
                                            prefix={name}
                                            disabled={!hasDriversActionsPermission}
                                            valueFieldName='value'
                                            key={name}
                                            handleRemove={() => handleFeeDelete(index, feeType)}
                                        />
                                    ))}
                                    {missingFees.length > 0 && (
                                        <AlertBlock view='danger'>
                                            <h4 className={cn('warning-title')}>{t('warning')}</h4>
                                            <p>{t('additional-driver-company-fees-warning')}:</p>
                                            {missingFees.map(fee => (
                                                <p key={fee.id} className={cn('missing-fee')}>
                                                    • <span>{fee.feeCategory.name}</span>
                                                </p>
                                            ))}
                                            <p>{t('remove-or-setup-company-fees-instructions')}</p>
                                        </AlertBlock>
                                    )}
                                    {hasDriversActionsPermission && renderAddButton({ fields, disabled: disabledButton })}
                                </>
                            )}
                        </FieldArray>
                    </FeesFieldsWrapper>
                );
            })}
        </div>
    );
};
