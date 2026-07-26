export const splitName = (fullName: string) => {
    const titleRegex = /^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Sir|Madam)\s+/;
    const suffixRegex = /,?\s+(PhD|DVM|Jr\.|Sr\.|II|III)$/;

    const cleanName = fullName.replace(titleRegex, '').replace(suffixRegex, '');
    const nameParts = cleanName.trim().split(/\s+/);

    if (nameParts.length === 0) {
        return { firstName: '', lastName: '' };
    }

    return { firstName: nameParts.shift(), lastName: nameParts.join(' ') };
};
