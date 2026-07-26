export type TrailerCategory = {
    id: number;
    name: string;
};

export type Specialization = {
    id: number;
    name: string;
    categories: TrailerCategory[];
};

export type SpecializationSliceState = {
    specializations: Specialization[];
};
