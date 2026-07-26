export type FormattedFee = {
    label: string;
    value: string;
};

export type FeesInfoProps = {
    fees: FormattedFee[];
    termLabel: string;
    driverPay?: string;
    isDangerDriverPay: boolean;
    driverPaymentTerm: 'instant' | 'delayed';
};
