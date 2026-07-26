export type CallingKeyboardProps = {
    onClose: () => void;
    onInputKey: (key: string) => void;
};

export type CallingKeyboardFormValue = {
    digits: string;
};
