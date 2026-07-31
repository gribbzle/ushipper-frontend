import { isString } from '../shared/type-guards';

import { FieldValidator } from './types';

export const passwordValidator =
    (email?: string): FieldValidator =>
    value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (value.length < 8) {
            return 'The password field must be at least 8 characters.';
        }

        if (value.length > 25) {
            return 'The password field must not be greater than 25 characters.';
        }

        if (!/[a-z]+/g.test(value) || !/[A-Z]+/g.test(value)) {
            return 'Password must contain at least one lowercase and uppercase letter';
        }

        if (!/[0-9]+/g.test(value)) {
            return 'Password must contain at least one number';
        }

        if (email && (email.toLowerCase() === value.toLowerCase() || value.toLocaleLowerCase().includes(email.toLocaleLowerCase()))) {
            return 'Password must not match email';
        }

        return null;
    };
