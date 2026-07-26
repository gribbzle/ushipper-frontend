export enum FundsTransferStatus {
    NONE = 'none',
    FACTORING_REQUESTED = 'factoring_requested',
    DOCUMENTS_REQUESTED = 'documents_requested',
    DOCUMENTS_SUBMITTED = 'documents_submitted',
    FACTORING_CONFIRMED = 'factoring_confirmed',
    INITIATED = 'initiated',
    COMPLETED = 'completed',
    DAMAGE_CLAIM = 'damage_claim',
}

export enum FundsTransferStatusView {
    PENDING = 'picked-up',
    INITIATED = 'initiated',
    COMPLETED = 'delivered',
    DECLINED = 'source-declined',
    DEFAULT = 'source-disabled',
}
