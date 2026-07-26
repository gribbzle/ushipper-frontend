export type SelectionGroupProps<T> = {
    items: {
        icon?: JSX.Element;
        value: T;
    }[];
    defaultValue?: T;
    onChange: (value: T) => void;
};
