type AppState = {
    client: {
        accounts: any;
    };
};

const accountsSelector = (state: AppState) => state.client.accounts;

export const accountsUsersSelector = (state: AppState) => {
    const { accounts } = accountsSelector(state);

    return accounts?.users;
};
