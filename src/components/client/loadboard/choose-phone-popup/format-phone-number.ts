import { translateByNamespace } from '@utils';

const ALREADY_FORMATTED_PHONE_NUMBER_LENGTH = 14;
const BY_PHONE_CODE = '+375';
const t = translateByNamespace('validators');

export const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) {
        return t('phone-number');
    }

    const [mainPhoneNumber, extension] = phoneNumber.split(' x');

    if (mainPhoneNumber.startsWith(BY_PHONE_CODE)) {
        const remainingNumber = mainPhoneNumber.substring(4);

        const formattedBelarusNumber = `${BY_PHONE_CODE} ${remainingNumber}`;

        if (extension) {
            return `${formattedBelarusNumber} x${extension}`;
        }

        return formattedBelarusNumber;
    }

    if (mainPhoneNumber.length === ALREADY_FORMATTED_PHONE_NUMBER_LENGTH) {
        return phoneNumber;
    }

    const formattedMainNumber = `(${mainPhoneNumber.substring(0, 3)}) ${mainPhoneNumber.substring(3, 6)}-${mainPhoneNumber.substring(6, 10)}`;

    if (extension) {
        return `${formattedMainNumber} x${extension}`;
    }

    return formattedMainNumber;
};
