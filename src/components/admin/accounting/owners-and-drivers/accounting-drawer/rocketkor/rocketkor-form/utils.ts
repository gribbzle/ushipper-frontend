import hasValue from 'has-values';

import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { Address } from '@types';
import { MailingAddress, RocketkorFormValue } from '../rocketkor.types';

const t = translateByNamespace('common:validators');

export const compareAddresses = (address1?: Address, address2?: Address) =>
    address1?.addressLine1 === address2?.addressLine1 &&
    address1?.addressLine2 === address2?.addressLine2 &&
    address1?.city === address2?.city &&
    address1?.country === address2?.country &&
    address1?.state === address2?.state &&
    address1?.zipCode === address2?.zipCode;

export const getMailingAddressValues = ({
    areAddressesSame,
    physicalAddress,
    mailingAddress,
}: Pick<RocketkorFormValue, 'areAddressesSame' | 'physicalAddress' | 'mailingAddress'>) => {
    if (areAddressesSame) {
        return physicalAddress;
    }

    if (hasValue(getObjectWithoutEmptyFields(mailingAddress ?? {}))) {
        return mailingAddress;
    }

    return null;
};

export const requiredIfAnyMailingAddressFieldFilled = ({ mailingAddress }: RocketkorFormValue) => {
    if (mailingAddress) {
        const addressKeys: Array<keyof Address> = ['addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country'];

        const atLeastOneFieldFilled = addressKeys.some(key => !!mailingAddress[key]);
        const allFieldsFilled = addressKeys.every(key => !!mailingAddress[key]);

        if (atLeastOneFieldFilled && !allFieldsFilled) {
            const errors = addressKeys.reduce((errorObj, key) => {
                if (!mailingAddress[key]) {
                    errorObj[key] = t('required-all-address', { type: 'mailing' });
                }

                return errorObj;
            }, {} as MailingAddress);

            return { mailingAddress: errors };
        }

        return undefined;
    }

    return undefined;
};
