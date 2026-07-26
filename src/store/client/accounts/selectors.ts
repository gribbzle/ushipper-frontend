import { AppState } from '@store';

const accountsSelector = (state: AppState) => state.client.accounts;

export const accountsUsersSelector = (state: AppState) => {
    const { accounts } = accountsSelector(state);

    return accounts?.users;
};
