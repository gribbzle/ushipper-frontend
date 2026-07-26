type Address = {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
};

export const formatAddress = ({ address, city, state, zip }: Address) => {
    const parts = [address, city && state ? `${city}, ${state}` : city || state, zip];
    const filteredParts = parts.filter(part => part);

    return filteredParts.join(' ');
};

export const extractStreetAndNumber = (address: string) => {
    if (!address) {
        return null;
    }
    const commaIndex = address.indexOf(',');

    if (commaIndex !== -1) {
        return address.substring(0, commaIndex);
    }

    return address;
};
