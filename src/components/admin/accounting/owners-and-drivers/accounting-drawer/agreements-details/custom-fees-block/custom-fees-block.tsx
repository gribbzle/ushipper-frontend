import React from 'react';
import has from 'has-values';
import { useForm } from 'react-final-form';

import { AlertBlock } from '@/components/common';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { translateByNamespace } from '@utils';

import { AgreementsDetailsFormState } from '../agreements-details.types';
import { CustomFeesFieldsArray } from '../custom-fees-fields-array';

import { useCustomFeesBlock } from './use-custom-fee-block';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');

export const CustomFeesBlock = ({ disabledAddButton, users }: { disabledAddButton: boolean; users?: AccountingAccountUserData[] }) => {
    const { companyNamesArray } = useCustomFeesBlock();
    const { getState } = useForm<AgreementsDetailsFormState>();
    const { accountFees } = getState().values;

    return (
        <>
            <CustomFeesFieldsArray fieldsName='accountFees' disabledButton={disabledAddButton} users={users} />
            {(has(accountFees?.delayedFees) || has(accountFees?.instantFees)) && (
                <AlertBlock>
                    {t('fee-settings-application-alert')}
                    {companyNamesArray.map(name => (
                        <React.Fragment key={name}>
                            <br /> • {name}
                        </React.Fragment>
                    ))}
                </AlertBlock>
            )}
        </>
    );
};
