import { FundsTransferStatus, FundsTransferStatusView } from '@/enums/funds-transfer-status';

export const FUNDS_TRANSFER_STATUS_VIEW: Record<FundsTransferStatus, FundsTransferStatusView> = {
    [FundsTransferStatus.NONE]: FundsTransferStatusView.PENDING,
    [FundsTransferStatus.FACTORING_REQUESTED]: FundsTransferStatusView.PENDING,
    [FundsTransferStatus.FACTORING_CONFIRMED]: FundsTransferStatusView.PENDING,
    [FundsTransferStatus.DOCUMENTS_REQUESTED]: FundsTransferStatusView.PENDING,
    [FundsTransferStatus.DOCUMENTS_SUBMITTED]: FundsTransferStatusView.PENDING,
    [FundsTransferStatus.INITIATED]: FundsTransferStatusView.COMPLETED,
    [FundsTransferStatus.COMPLETED]: FundsTransferStatusView.COMPLETED,
    [FundsTransferStatus.DAMAGE_CLAIM]: FundsTransferStatusView.DECLINED,
};
