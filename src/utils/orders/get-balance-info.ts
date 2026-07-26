const DEFAULT_BALANCE_LIMIT = 500;

export const getBalanceInfo = (balanceAmount: string) => {
    const balanceValue = Number(balanceAmount) / 100;
    const isSuccess = balanceValue > DEFAULT_BALANCE_LIMIT;
    const isDanger = balanceValue < 0;
    const isAwaiting = !isSuccess && !isDanger;

    return { balanceValue, isSuccess, isDanger, isAwaiting };
};
