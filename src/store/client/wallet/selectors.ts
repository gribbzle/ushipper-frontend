type AppState = {
    client: {
        wallet: any;
    };
};

import { CashOutTransactionPopupPropsState } from './types';

const walletSelectors = (state: AppState) => state.client.wallet;

export const cashOutTransactionPopupPropsSelector = (state: AppState): CashOutTransactionPopupPropsState => walletSelectors(state).cashOutTransactionPopupProps;
