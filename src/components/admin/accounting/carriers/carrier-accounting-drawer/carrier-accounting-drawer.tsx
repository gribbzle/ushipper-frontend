import React from 'react';
import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';

import { Drawer } from '@/components/common/drawer/drawer';
import { SaveButton } from '@/components/common/button/SaveButton';
import { CarrierAccountingDrawerTab } from '@enums';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountsFieldsBlock } from './accounts-fields-block';
import { CarrierAccountingDrawerFormValue } from './carrier-accounting-drawer.types';
import { CarrierAccountingDrawerTabs } from './carrier-accounting-drawer-tabs';
import { EnablePaymentSystemSwitch } from './enable-payment-system-switch';
import { FactoringFieldsBlock } from './factoring-fields-block';
import { FeesFieldsBlock } from './fees-fields-block';
import { IsPartnerSwitch } from './is-partner-switch';
import { useCarrierAccountingDrawer } from './useCarrierAccountingDrawer';

import './carrier-accounting-drawer.scss';

const cn = classname('carrier-accounting-drawer');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export const CarrierAccountingDrawer = () => {
    const { title, formRef, initialValues, isDrawerOpened, selectedTab, isError, handleClose, handleSubmit, handleSubmitClick } = useCarrierAccountingDrawer();

    return (
        <Drawer
            head={title}
            body={
                isError ? (
                    <div className={cn('empty')}>{t('upload-carrier-error')}</div>
                ) : (
                    <Form<CarrierAccountingDrawerFormValue>
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                        subscription={{ values: true }}
                        mutators={{
                            ...arrayMutators,
                        }}
                        render={({ form, values: { isPartner } }) => {
                            formRef.current = form;

                            return (
                                <form className={cn('form')}>
                                    <IsPartnerSwitch />
                                    {isPartner && (
                                        <>
                                            <EnablePaymentSystemSwitch />
                                            <CarrierAccountingDrawerTabs />
                                            {selectedTab === CarrierAccountingDrawerTab.FEES && <FeesFieldsBlock formRef={formRef} />}
                                            {selectedTab === CarrierAccountingDrawerTab.FACTORING && <FactoringFieldsBlock />}
                                            {selectedTab === CarrierAccountingDrawerTab.ACCOUNTS && <AccountsFieldsBlock />}
                                        </>
                                    )}
                                </form>
                            );
                        }}
                    />
                )
            }
            actions={!isError && selectedTab !== CarrierAccountingDrawerTab.ACCOUNTS && <SaveButton onClick={handleSubmitClick} />}
            isOpen={isDrawerOpened}
            onClose={handleClose}
        />
    );
};
