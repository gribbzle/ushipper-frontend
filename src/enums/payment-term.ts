// delete after complete update of data on the backend
export enum B2C {
    COD = 'cod',
    QuickPay = 'quickpay',
    Comcheck = 'comcheck',
    COP = 'cop',
    CKOD = 'ckod',
    ACH = 'ach',
    Factoring = 'factoring',
    Venmo = 'venmo',
    CashApp = 'cashapp',
    UShip = 'uship',
    Zelle = 'zelle',
    FiveDays = '5_days',
    SevenDays = '7_days',
    FifteenDays = '15_days',
    TwentyDays = '20_days',
    ThirtyDays = '30_days',
    FortyFiveDays = '45_days',
    SixtyDays = '60_days',
    Other = 'other',
}

export enum InstantPaymentTerm {
    COP = 'cop',
    COD = 'cod',
}

export enum DelayedPaymentTerm {
    BUSINESS_DAYS_2 = '2_business_days',
    BUSINESS_DAYS_5 = '5_business_days',
    BUSINESS_DAYS_7 = '7_business_days',
    BUSINESS_DAYS_10 = '10_business_days',
    BUSINESS_DAYS_15 = '15_business_days',
    BUSINESS_DAYS_20 = '20_business_days',
    BUSINESS_DAYS_30 = '30_business_days',
    OTHER = 'other',
}

export enum PaymentTerm {
    COP = 'cop',
    COD = 'cod',
    BUSINESS_DAYS_2 = '2_business_days',
    BUSINESS_DAYS_5 = '5_business_days',
    BUSINESS_DAYS_7 = '7_business_days',
    BUSINESS_DAYS_10 = '10_business_days',
    BUSINESS_DAYS_15 = '15_business_days',
    BUSINESS_DAYS_20 = '20_business_days',
    BUSINESS_DAYS_30 = '30_business_days',
    OTHER = 'other',
}

export const INSTANT_TERMS = [PaymentTerm.COP, PaymentTerm.COD];

export const DELAYED_TERMS = [
    PaymentTerm.BUSINESS_DAYS_2,
    PaymentTerm.BUSINESS_DAYS_5,
    PaymentTerm.BUSINESS_DAYS_7,
    PaymentTerm.BUSINESS_DAYS_10,
    PaymentTerm.BUSINESS_DAYS_15,
    PaymentTerm.BUSINESS_DAYS_20,
    PaymentTerm.BUSINESS_DAYS_30,
    PaymentTerm.OTHER,
];
