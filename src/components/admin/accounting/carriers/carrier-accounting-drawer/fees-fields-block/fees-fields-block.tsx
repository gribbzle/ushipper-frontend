import React, { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { FieldArray } from 'react-final-form-arrays';

import { PROJECT_KEY_NAME } from '@constants';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { EditFeeItem, FeesFieldsWrapper, getFeeTermTypesFieldsOfProject, renderAddButton } from '../../../common';
import { CarrierAccountingDrawerFormValue } from '../carrier-accounting-drawer.types';

import { useFeesFieldsBlock } from './use-fees-fields-block';

import './fees-fields-block.scss';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');
const cn = classname('fees-fields-block');

export const FeesFieldsBlock = ({ formRef }: { formRef: MutableRefObject<FormApi<CarrierAccountingDrawerFormValue> | undefined> }) => {
    const { handleFeeDelete } = useFeesFieldsBlock(formRef);

    return (
        <div className={cn()}>
            {getFeeTermTypesFieldsOfProject().map(feeType => (
                <FeesFieldsWrapper title={t(`${PROJECT_KEY_NAME}-${feeType.replace('Fees', '')}-terms-title`)} key={feeType}>
                    <FieldArray name={feeType}>
                        {({ fields }) => (
                            <>
                                {fields.map((name, index) => (
                                    <EditFeeItem
                                        prefix={name}
                                        valueFieldName='value'
                                        key={`${feeType}-${name}`}
                                        handleRemove={() => handleFeeDelete(index, feeType)}
                                    />
                                ))}
                                {renderAddButton({ fields, disabled: false })}
                            </>
                        )}
                    </FieldArray>
                </FeesFieldsWrapper>
            ))}
        </div>
    );
};
