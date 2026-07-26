import { ReactNode } from 'react';

export type OfferActionModalProps = {
    title?: string;
    children: ReactNode;
    actions?: ReactNode;
    isOpen: boolean;
    type: 'accept' | 'decline';
    onAction: () => void;
    onClose: () => void;
};
