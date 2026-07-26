export type AssignUserSearchState = {
    name: string;
};

export type AssignUserSearchProps = {
    onChange: (name: string) => void;
    initValue?: string;
};
