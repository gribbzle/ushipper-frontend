import React from 'react';
import arrayMutators from 'final-form-arrays';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { ContractorTypesEnum } from '@/enums/contractor-types-enum';
import { FeesRule } from '@/enums/fee/fees-rules-enum';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AgreementsDetailsFormState } from './agreements-details.types';
import { AssignedCompaniesBlock } from './assigned-companies-block';
import { CompaniesFeesBlock } from './companies-fees-block';
import { ContractorTypeSelectionButtonGroup } from './contractor-type-selection-button-group';
import { CustomFeesBlock } from './custom-fees-block';
import { DriverAccountSettingsBlock } from './driver-account-settings-block';
import { DriverOwnersSelect } from './driver-owners-select';
import { FeeRulesSelectionButtonGroup } from './fee-rules-selection-button-group';
import { FuelCardsBlock } from './fuel-cards-block';
import { FuelCardsSettingsBlock } from './fuel-cards-settings-block';
import { RecurringFeesFieldsArray } from './recurring-fees-fields-block';
import { useAgreementsDetails } from './use-agreements-details';

import './agreements-details.scss';
import PlusIcon from '@/assets/icons/plus.svg';

const cn = classname('agreements-details');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');
const tFees = translateByNamespace('admin:accounting:carrier-accounting-drawer:tabs');

export const AgreementsDetails = () => {
    const {
        hasDriversActionsPermission,
        account,
        partnerUsers,
        filteredUsers,
        formRef,
        agreementsFormId,
        initialValues,
        disabledAddButton,
        onSubmit,
        handleAddNewDriverOwnerClick,
    } = useAgreementsDetails();

    return (
        <Form<AgreementsDetailsFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            mutators={{ ...arrayMutators }}
            onSubmit={onSubmit}
            render={({ form, handleSubmit, values: { contractorType, rules } }) => {
                formRef.current = form;

                return (
                    <form onSubmit={handleSubmit} className={cn('', { wrapper: true })} id={agreementsFormId}>
                        <FormControl className={cn('contractor-type')}>
                            <InputLabel>{t('contractor-type-label')}</InputLabel>
                            <ContractorTypeSelectionButtonGroup name='contractorType' disabled={!hasDriversActionsPermission} />
                        </FormControl>
                        <div className={cn('', { reverse: contractorType === ContractorTypesEnum.DRIVER })}>
                            <div className={cn('')}>
                                <AssignedCompaniesBlock users={partnerUsers} />
                                {account?.publicId && (
                                    <>
                                        <FuelCardsBlock accountId={account.publicId} accountName={account?.name} />
                                        <FuelCardsSettingsBlock fieldsPrefix='fuelCardsSettings' disabled={!hasDriversActionsPermission} />
                                    </>
                                )}
                            </div>
                            {contractorType === ContractorTypesEnum.DRIVER_OWNER && (
                                <>
                                    <Divider>{tFees('fees')}</Divider>
                                    <FormControl className={cn('fees-rules')}>
                                        <InputLabel>{t('fees-rules-label')}</InputLabel>
                                        <FeeRulesSelectionButtonGroup name='rules' disabled={!hasDriversActionsPermission} />
                                    </FormControl>
                                    {rules === FeesRule.COMPANY_RULES ? (
                                        <CompaniesFeesBlock users={filteredUsers} />
                                    ) : (
                                        <CustomFeesBlock disabledAddButton={disabledAddButton} users={filteredUsers} />
                                    )}
                                </>
                            )}
                            {contractorType === ContractorTypesEnum.DRIVER && (
                                <div className={cn('')}>
                                    <FormControl className={cn('driver-owner')}>
                                        <InputLabel>{t('driver-owner-label')}</InputLabel>
                                        <Field
                                            name='parentId'
                                            component={DriverOwnersSelect}
                                            excludedDriverId={account?.publicId}
                                            disabled={!hasDriversActionsPermission}
                                        />
                                    </FormControl>
                                    {hasDriversActionsPermission && (
                                        <Button view='link' active={true} size='mini' onClick={() => handleAddNewDriverOwnerClick()} className={cn('add-new')}>
                                            <PlusIcon /> {t('add-new-owner-label')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <>
                            {contractorType === ContractorTypesEnum.DRIVER && <Divider>{tFees('fees')}</Divider>}
                            <RecurringFeesFieldsArray fieldsName='accountFees' disabledButton={disabledAddButton} />
                            <DriverAccountSettingsBlock fieldsPrefix='driverSettings' disabled={!hasDriversActionsPermission} />
                        </>
                    </form>
                );
            }}
        />
    );
};
