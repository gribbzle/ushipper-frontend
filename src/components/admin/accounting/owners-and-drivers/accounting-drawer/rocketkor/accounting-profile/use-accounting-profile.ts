import { useMemo } from 'react';

import { useDownloadAttachment } from '@/hooks/useDownload';
import { useCountriesAndStates } from '@/hooks/use-countries-and-states';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { useGetAccountingProfile } from '../../hooks/use-get-accounting-profile';
import { useGetAccountingProfileDocuments } from '../../hooks/use-get-accounting-profile-documents';
import { useLegalEntityTypes } from '../use-legal-entity-types';

export const useAccountingProfile = () => {
    const { states, countries } = useCountriesAndStates();
    const legalEntityTypes = useLegalEntityTypes();
    const { account, accountingProfile } = useGetAccountingProfile();

    if (!accountingProfile) {
        throw new Error('No accounting data');
    }

    const { physicalAddress, mailingAddress } = accountingProfile;

    const documents = useGetAccountingProfileDocuments();

    const { downloadAttachment } = useDownloadAttachment();

    const physicalCountry = useMemo(
        () => countries?.find(country => country.alpha3 === accountingProfile.physicalAddress.country),
        [countries, accountingProfile],
    );
    const physicalState = useMemo(() => states?.find(state => state.alpha2 === accountingProfile.physicalAddress.state), [states, accountingProfile]);

    const mailingCountry = useMemo(
        () => countries?.find(country => country.alpha3 === accountingProfile.mailingAddress.country),
        [countries, accountingProfile],
    );
    const mailingState = useMemo(() => states?.find(state => state.alpha2 === accountingProfile.mailingAddress.state), [states, accountingProfile]);

    const physicalAddressInfo = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                county: physicalCountry?.title,
                state: physicalState?.title,
                city: physicalAddress?.city,
                addressLine1: physicalAddress.addressLine1,
                addressLine2: physicalAddress.addressLine2,
                zip: physicalAddress?.zipCode,
            }),
        [
            physicalAddress.addressLine1,
            physicalAddress.addressLine2,
            physicalAddress?.city,
            physicalAddress?.zipCode,
            physicalCountry?.title,
            physicalState?.title,
        ],
    );

    const mailingAddressInfo = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                county: mailingCountry?.title,
                state: mailingState?.title,
                city: mailingAddress?.city,
                addressLine1: mailingAddress.addressLine1,
                addressLine2: mailingAddress.addressLine2,
                zip: mailingAddress?.zipCode,
            }),
        [mailingAddress.addressLine1, mailingAddress.addressLine2, mailingAddress?.city, mailingAddress?.zipCode, mailingCountry?.title, mailingState?.title],
    );

    return {
        account,
        documents,
        mailingAddress,
        physicalAddress,
        accountingProfile,
        taxIdCountry: countries?.find(country => country.alpha3 === accountingProfile.taxIdCountry),
        legalEntityType: legalEntityTypes.find(legalEntityType => legalEntityType.value === accountingProfile.legalEntityType),
        downloadAttachment,
        physicalAddressInfo,
        mailingAddressInfo,
    };
};
