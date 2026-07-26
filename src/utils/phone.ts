export const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.length === 11 ? cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/) : cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return cleaned.length === 11 ? `(${match[2]}) ${match[3]}-${match[4]}-${match[5]}` : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    return phone;
};

export const formatInternationalPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');

    if (phone.startsWith('+') && cleaned.length > 11) {
        const countryCodeLength = cleaned.length - 9;
        const countryCode = cleaned.slice(0, countryCodeLength);
        const localNumber = cleaned.slice(countryCodeLength);

        const match = localNumber.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);

        if (match) {
            return `+${countryCode} (${match[1]}) ${match[2]} - ${match[3]} - ${match[4]}`;
        }
    }

    const localCleaned = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned;

    if (localCleaned.length === 10) {
        return `(${localCleaned.substring(0, 3)}) ${localCleaned.substring(3, 6)} - ${localCleaned.substring(6, 10)}`;
    }

    return `(${cleaned?.substring(0, 3)}) ${cleaned?.substring(3, 6)} - ${cleaned?.substring(6, 10)}`;
};

export const cleanPhoneNumber = (phoneNumber: string) => {
    const [mainPhoneNumber] = phoneNumber.split(' x');

    return mainPhoneNumber.replace(/\D/g, '');
};

export const formatExternalPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length > 11) {
        const countryCodeLength = cleaned.length - 9;
        const countryCode = cleaned.slice(0, countryCodeLength);
        const localNumber = cleaned.slice(countryCodeLength);

        const match = localNumber.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);

        if (match) {
            return `+${countryCode} ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
    }

    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned.substring(0, 1)} ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 11)}`;
    }

    if (cleaned.length === 10) {
        return `+1 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 10)}`;
    }

    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)} ${cleaned.substring(6, 10)}`;
};
