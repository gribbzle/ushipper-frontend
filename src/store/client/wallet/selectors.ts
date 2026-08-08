import { AppState } from "@store";

import { CashOutTransactionPopupPropsState } from './types';

const walletSelectors = (state: AppState) => state.client.wallet;

export const cashOutTransactionPopupPropsSelector = (state: AppState): CashOutTransactionPopupPropsState => walletSelectors(state).cashOutTransactionPopupProps;
