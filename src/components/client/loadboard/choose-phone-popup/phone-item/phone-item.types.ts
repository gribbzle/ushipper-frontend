export type PhoneItemProps = {
    type: 'main' | 'local' | 'fax';
    isMessage?: boolean;
    phoneNumber: string;
    onClick: () => void;
};
