import React from 'react';

import { EmptyRocketkor } from '@/components/admin/accounting/common/empty-rocketkor/empty-rocketkor';
import { Loader } from '@/components/common';

import { OwnershipDocumentPopup } from './rocketkor-form/popups/ownership-document-popup';
import { PassportPopup } from './rocketkor-form/popups/passport-popup';
import { TaxDocumentPopup } from './rocketkor-form/popups/tax-document-popup';
import { AccountingProfile } from './accounting-profile';
import { RocketkorForm } from './rocketkor-form';
import { useRocketkor } from './use-rocketkor';

export const RocketkorCompleteForm = ({ handleCloseForm }: { handleCloseForm: () => void }) => (
    <>
        <RocketkorForm handleCloseForm={handleCloseForm} />
        <TaxDocumentPopup />
        <OwnershipDocumentPopup />
        <PassportPopup />
    </>
);

export const Rocketkor = () => {
    const { isLoading, isRocketkorFormVisible, accountingProfile, handleEdit, handleCloseForm, handleOpenForm } = useRocketkor();

    if (isLoading) {
        return <Loader />;
    }

    if (accountingProfile) {
        return <AccountingProfile handleEdit={handleEdit} />;
    }

    return isRocketkorFormVisible ? <RocketkorCompleteForm handleCloseForm={handleCloseForm} /> : <EmptyRocketkor onChange={handleOpenForm} />;
};
