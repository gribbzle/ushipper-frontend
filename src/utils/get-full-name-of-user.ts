/**
 * Constructs a full name from the given name parts.
 * @param {string} firstName - The first name of the person.
 * @param {string} lastName - The last name of the person.
 * @param {string} [middleName] - Optional middle name of the person.
 * @returns {string} - The constructed full name.
 */

export const getFullNameOfUser = (firstName?: string, lastName?: string, middleName?: string) => {
    firstName = firstName?.trim() || '';
    middleName = middleName?.trim() || '';
    lastName = lastName?.trim() || '';

    return [firstName, middleName, lastName].filter(Boolean).join(' ');
};
