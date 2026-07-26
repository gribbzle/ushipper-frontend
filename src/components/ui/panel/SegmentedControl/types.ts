export type SegmentedControlOption = {
    label: string;
    value: string | number;
};

export type SegmentedControlProps = {
    name: string;
    segments: SegmentedControlOption[];
    defaultIndex?: number;
    callback?: (value: string | number) => void;
    autoWidth?: boolean;
};
